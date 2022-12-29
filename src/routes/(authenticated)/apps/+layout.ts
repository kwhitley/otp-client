import { otp } from '~/services/api'

export async function load({ params, ...other }) {
  await otp.getApps()
}
