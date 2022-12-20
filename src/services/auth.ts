import { persistable } from '~/utils/persistable'
import { writable, get } from 'svelte/store'
import { fetcher as ittyFetcher } from 'itty-fetcher'

const otp = ittyFetcher({ base: 'http://localhost:8787' })
let appID = undefined
let timer = undefined
let token = undefined
let sessionID = undefined
let pendingSession
let resolveSession

export const fetcher = (config = {}) => {
  if (token) return ittyFetcher({ ...config, headers: { Authorization: `Bearer ${token}` }})
  return ittyFetcher(config)
}

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
    .then(({ jwt, sessionID, tokenExpires, sessionExpires }) => {
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
    })
    .catch((err) => {
      console.warn('there was an error fetching the session', err.message)
    })
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

  otp
    .post(`/app/${appID}/login`, { id })
    .then(({ sessionID }) => {
      setSession({ sessionID })
      checkSessionStatus(sessionID, 1000)
    })
    .catch(() => setState({ error: 'There was an error during login.' }))

  pendingSession = new Promise((resolve, reject) => {
    resolveSession = resolve
  })

  return pendingSession
}

const checkSession = () => {
  const currentSession = get(session)
  console.log('checking session...', currentSession)
  const currentState = get(state)

  const sessionExpires = new Date(currentSession.sessionExpires * 1000)
  const tokenExpires = new Date(currentSession.tokenExpires * 1000)
  const now = new Date()

  if (!currentSession.jwt) {
    sessionID = undefined

    return
  }

  if (sessionExpires <= now) {
    console.log('session has expired')
    return logout()
  }

  if (tokenExpires <= now) {
    console.log('token has expired, renewing...')
    return getSession(currentSession.sessionID)
  }

  console.log('session is still good!')
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
