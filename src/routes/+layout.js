import * as auth from '~/services/auth'

auth.setAppID('test')

export const load = async ({ url: { pathname } }) => {
	return { pathname }
}
