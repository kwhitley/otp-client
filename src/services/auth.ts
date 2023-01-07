import { persistable } from '~/utils/persistable'
import { writable, get } from 'svelte/store'
import { fetcher as ittyFetcher, StatusError } from 'itty-fetcher'

const OTP_PROTOCOL = import.meta.env.DEV
                    ? 'http://'
                    : 'https://'
const OTP_WS = import.meta.env.DEV
                    ? 'ws://'
                    : 'wss://'
const OTP_DOMAIN = import.meta.env.DEV
                    ? 'localhost:8787'
                    : 'otp.garden'

const otp = ittyFetcher({ base: OTP_PROTOCOL + OTP_DOMAIN })
let appID = undefined
let timer = undefined
let token = undefined
let sessionID = undefined
let refreshTimer = undefined
let pendingSession
let resolveSession
let rejectSession

const REFRESH_TOKEN_WINDOW = 10 * 1000 // 10 seconds

export const setAppID = (id: string) => {
  appID = id
}

export const state = writable({
  error: undefined,
  waiting: false,
})

export const session = persistable('session', {
  previouslyLoggedIn: false,
  jwt: undefined,
  isLoggedIn: false,
  sessionStart: undefined,
  sessionID: undefined,
  sessionExpires: undefined,
  tokenExpires: undefined,
})

const setSession = (patch: object) => session.update(existing => ({
  ...existing,
  ...patch,
}))

const setState = (patch: object) => state.update(existing => ({
  ...existing,
  ...patch,
}))

export const logout = () => {
  session.set({})
  state.set({})

  if (sessionID) {
    if (!appID) {
      throw new Error('use auth.setAppID(id) to connect your application.')
    }

    otp
      .get(`/end-session/${sessionID}`)
      .catch(() => setState({ error: 'There was an error during logout.' }))
  }
}

export type Session = {
  jwt: string,
  sessionID: string,
  tokenExpires: number,
  sessionExpires: number,
}

const receiveSession = (session: Session) => {
  const { jwt, sessionID, tokenExpires, sessionExpires } = session

  if (!jwt) return setState({ error: 'Expected a JWT token.' })
  if (!sessionID) return setState({ error: 'Expected a sessionID.' })
  if (!tokenExpires) return setState({ error: 'Expected a tokenExpires.' })
  if (!sessionExpires) return setState({ error: 'Expected a sessionExpires.' })

  token = jwt

  setSession({
    sessionID,
    jwt,
    isLoggedIn: true,
    tokenExpires,
    sessionExpires,
  })

  setState({
    waiting: false,
    error: undefined,
  })

  if (resolveSession) {
    resolveSession()
  }

  refreshSessionBeforeExpiration(session)
}

const listenForUnlock = (sessionID) => new Promise((resolve, reject) => {
  try {
    const socket = new WebSocket(`${OTP_WS}${OTP_DOMAIN}/app/otpg/connect?sessionID=${sessionID}`)

    socket.addEventListener('error', (e) => {
      reject(false)
    })

    socket.addEventListener('open', event => {
      console.log('OTP socket created')
      setState({ waiting: true })
      resolve(true)
    })

    socket.addEventListener('message', event => {
      console.log('Message received from server', event.data)

      try {
        const message = JSON.parse(event.data)
        if (message.type === 'token') {
          receiveSession(message.token)
        } else {
          console.log('received message from app', message)
        }
      } catch(err) {
        console.error('There was an error receiving the socket message', event.data, err.message, err.stack)
      }
    })
  } catch(err) {
    console.error('Could not create socket:', err.message)
    reject(false)
  }
})

const fetchSession = (sessionID: string) => {
  console.log('getting session', sessionID)

  otp
    .get(`/session/${sessionID}`)
    .then(receiveSession)
    .catch((err) => {
      console.warn('there was an error fetching the session', err.message)
    })
}

const refreshSessionBeforeExpiration = (session) => {
  const { tokenExpires, sessionID } = session
  const refreshDate = tokenExpires * 1000 - Date.now() - REFRESH_TOKEN_WINDOW
  console.log('token expires at', new Date(tokenExpires * 1000))
  console.log('refreshing in', refreshDate / 1000|0, 'seconds')
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => fetchSession(sessionID), refreshDate)
}

const checkSessionStatus = (sessionID, interval = undefined) => {
  if (interval) {
    setState({ waiting: true })
    return timer = setInterval(() => checkSessionStatus(sessionID), interval)
  }

  otp
    .get(`/session/${sessionID}/status`)
    .then(({ active }) => {
      if (!active) return

      // otherwise session is ready, get it

      console.log('clearing interval timer')
      clearInterval(timer)
      fetchSession(sessionID)
    })
}

export const login = (id) => {
  if (!id) {
    return setState({ error: 'Must have an identifier to begin login.' })
  }

  if (!appID) {
    throw new Error('use auth.setAppID(id) to connect your application.')
  }


    // .catch(() => setState({ error: 'There was an error during login.' }))

  pendingSession = new Promise((resolve, reject) => {
    resolveSession = resolve
    rejectSession = reject
  })

  otp
    .post(`/app/${appID}/login`, { id })
    .then(async ({ sessionID }) => {
      setSession({ sessionID })

      listenForUnlock(sessionID)
        .catch(() => {
          checkSessionStatus(sessionID, 1000)
        })
    })
    .catch(err => {
      // console.log('login error', err)
      rejectSession(err)
    })

  return pendingSession
}

const checkSession = () => {
  const currentSession = get(session)
  console.log('checking session...', currentSession)
  const currentState = get(state)

  const sessionExpires = +new Date(currentSession.sessionExpires * 1000)
  const tokenExpires = +new Date(currentSession.tokenExpires * 1000)
  const now = +new Date()

  if (!currentSession.jwt) {
    sessionID = undefined

    return
  }

  if (sessionExpires <= now) {
    console.log('session has expired')
    return logout()
  }

  if (tokenExpires <= now) {
    console.log('token has expired or is about to expire, renewing...')
    return fetchSession(currentSession.sessionID)
  }

  console.log('session is still good!')
  refreshSessionBeforeExpiration(currentSession)
}

session.subscribe(values => {
  checkSession()

  if (values?.sessionID) {
    // console.log('updating global sessionID')
    sessionID = values.sessionID
  }

  if (values?.jwt) {
    // console.log('updating global jwt')
    token = values.jwt
  }
})

export const cancel = () => {
  console.log('canceling login...')

  setState({
    waiting: false,
  })

  clearInterval(timer)
  timer = undefined

  rejectSession()
}

export const fetcher = (config = {}) => {
  const options = {
    handleResponse: (response) => {
      // handle unauthenticated requests
      if (response.status === 401) {
        logout()
      }

      if (!response.ok) throw new StatusError(response.status, response.statusText)

      const contentType = response.headers.get('content-type')

      return contentType.includes('json')
        ? response.json()
        : response
    },
    ...config,
  }

  if (token) return ittyFetcher({
    ...options,
    headers: { Authorization: `Bearer ${token}` },
  })

  return ittyFetcher(options)
}
