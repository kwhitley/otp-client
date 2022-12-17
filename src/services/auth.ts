import { persistable } from '~/utils/persistable'
import { writable } from 'svelte/store'
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
  isLoggedIn: false,
  jwt: undefined,
  refresh: undefined,
  sessionStart: undefined,
  sessionID: undefined,
  expires: undefined,
})

const setSession = (patch: object) => session.update(existing => ({
  ...existing,
  ...patch,
}))

const setState = (patch: object) => state.update(existing => ({
  ...existing,
  ...patch,
}))

session.subscribe(values => {
  if (values.jwt) {
    // console.log('updating session with new jwt', values.jwt)
  }
  if (values?.sessionID) {
    // console.log('updating global sessionID')
    sessionID = values.sessionID
  }

  if (values?.jwt) {
    // console.log('updating global jwt')
    token = values.jwt
  }
})

const checkSessionStatus = (sessionID, interval = undefined) => {
  if (interval) {
    setState({ waiting: true })
    return timer = setInterval(() => checkSessionStatus(sessionID), interval)
  }

  otp
    .get(`/session/${sessionID}`)
    .then(({ jwt, refresh, duration, expires }) => {
      if (!jwt) return setState({ error: 'Expected a JWT token.' })
      if (!refresh) return setState({ error: 'Expected a refresh key.' })
      if (!duration) return setState({ error: 'Expected a duration.' })
      if (!expires) return setState({ error: 'Expected an expiration timestamp.' })

      token = jwt

      setSession({
        sessionID: refresh,
        jwt,
        isLoggedIn: true,
        expires,
        duration,
      })

      setState({
        waiting: false,
        error: undefined,
      })

      console.log('clearing interval timer')
      clearInterval(timer)

      if (resolveSession) {
        resolveSession()
      }
    })
    .catch(() => {})
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

export const logout = () => {
  session.set({})
  state.set({})

  if (!sessionID) {
    return setState({ error: 'Must have an identifier to begin login.' })
  }

  if (!appID) {
    throw new Error('use auth.setAppID(id) to connect your application.')
  }

  otp
    .get(`/end-session/${sessionID}`)
    .catch(() => setState({ error: 'There was an error during logout.' }))
}
