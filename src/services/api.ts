import { fetcher } from '~/services/auth'

const dev = import.meta.env.DEV

const PROTOCOL = dev ? 'http://' : 'https://'
const DOMAIN = dev ? 'localhost:8787' : 'otp.garden'
const OTP_BASE = `${PROTOCOL}${DOMAIN}`
const ITTY_BASE = 'https://api.itty.industries'
const OTP_FETCHER = { base: OTP_BASE }
const ITTY_FETCHER = { base: ITTY_BASE }

export const itty = {
  getProfile: () => fetcher(ITTY_FETCHER).get('/my/profile'),
  updateProfile: (changes) => fetcher(ITTY_FETCHER).patch('/my/profile', changes),
}

export const otp = {

}
