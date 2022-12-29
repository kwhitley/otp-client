import { persistable } from './utils/persistable'
import { writable } from 'svelte/store'

export const headerIsOpen = writable(false)
export const profile = writable({})
export const apps = writable([])
export const app = writable()
