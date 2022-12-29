import * as auth from '~/services/auth'

auth.setAppID('otpg')

export const load = async ({ url: { pathname } }) => {
	return {
    rootPath: pathname.match(/^\/\w+/)?.[0],
    pathname
  }
}
