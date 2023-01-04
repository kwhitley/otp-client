import { persistable } from '~/utils/persistable'
import { writable, get } from 'svelte/store'
import { fetcher as ittyFetcher } from 'itty-fetcher'

const OTP_URL = import.meta.env.DEV
              ? 'http://localhost:8787'
              : 'https://otp.garden'

const otp = ittyFetcher({ base: OTP_URL })
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

const getSession = (sessionID: string) => {
  console.log('getting session', sessionID)

  otp
    .get(`/session/${sessionID}`)
    .then((response) => {
      const { jwt, sessionID, tokenExpires, sessionExpires } = response
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

      refreshSessionBeforeExpiration(response)

      // set timer for refresh
      // const refreshDate = tokenExpires * 1000 - 30000 - Date.now()
      // console.log('token expires at', new Date(tokenExpires * 1000))
      // console.log('refreshing in', refreshDate / 1000|0, 'seconds')
      // clearTimeout(refreshTimer)
      // refreshTimer = setTimeout(() => getSession(sessionID), refreshDate)
    })
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
  refreshTimer = setTimeout(() => getSession(sessionID), refreshDate)
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
      getSession(sessionID)
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
    .then(({ sessionID }) => {
      setSession({ sessionID })
      checkSessionStatus(sessionID, 1000)
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
    return getSession(currentSession.sessionID)
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
  if (token) return ittyFetcher({ ...config, headers: { Authorization: `Bearer ${token}` }})

  return ittyFetcher(config)
}
