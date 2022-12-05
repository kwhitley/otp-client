import { DEV } from '~/constants'

export const pageTitle = (...args) => [`OTP garden${ DEV ? ' (dev)' : '' }`, ...args].join(' : ')
