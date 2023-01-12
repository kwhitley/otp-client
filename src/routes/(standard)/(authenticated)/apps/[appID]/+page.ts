import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { otp } from '~/services/api'

export async function load({ params, ...other }) {
  const { appID } = params
  const app = await otp.getApp(appID)

  if (browser && !app) {
    console.log('app could not be found... redirecting to /apps')
    goto('/apps')
  }

  return { appID }
}
