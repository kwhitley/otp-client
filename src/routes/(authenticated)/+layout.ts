import { get } from 'svelte/store'
import { session } from '~/services/auth'

export const load = async ({ url: { pathname } }) => {
  const currentSession = get(session)

	return {
    pathname,
    isLoggedIn: currentSession.jwt,
  }
}
