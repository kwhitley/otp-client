import { fetcher } from '~/services/auth'
import { apps, app } from '~/stores'

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
  getApps: () => fetcher(OTP_FETCHER)
                  .get('/my/apps')
                  .then(v => apps.set(v) || v)
                  .catch(err => {
                    console.log('error loading app')
                  }),
  getApp: (id: string) => fetcher(OTP_FETCHER)
                            .get(`/my/apps/${id}`)
                            .then(v => app.set(v) || v)
                            .catch(err => {
                              console.log('error loading app')
                            }),
  createApp: () => fetcher(OTP_FETCHER)
                    .post('/my/apps')
                    .then(v => otp.getApps() && v)
                    .catch(err => {
                      console.log('There was an error creating this app', err.message)
                    }),
  updateApp: (id: string, changes: any[]) =>
                fetcher(OTP_FETCHER)
                  .patch(`/my/apps/${id}`, changes)
                  .then(v => app.set(v) || otp.getApps()),
  deleteApp: (id: string) => fetcher(OTP_FETCHER).delete(`/my/apps/${id}`).then(otp.getApps),
}
