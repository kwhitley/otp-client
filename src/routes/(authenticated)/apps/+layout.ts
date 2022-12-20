import { otp } from '~/services/api'

export async function load({ params, ...other }) {
  const apps = await otp.getApps()
}
