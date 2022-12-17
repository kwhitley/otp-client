import { persistable } from './utils/persistable'
import { writable } from 'svelte/store'

export const headerIsOpen = writable(false)
export const profile = writable({})
