import { goto } from '$app/navigation'
import { writable, get } from 'svelte/store'
import { session } from '~/services/auth'

export const load = async ({ url: { pathname } }) => {
  const currentSession = get(session)
  if (!currentSession.isLoggedIn) {
    console.log('not logged in.')
  } else {
    console.log('logged in')
  }
	return { pathname }
}
