import clone from 'just-clone'
import { diff } from 'just-diff'
import { get, writable, derived } from 'svelte/store'

type EditableOptions = {
  trim: boolean
}

export const editable = (store, options?: EditableOptions) => {
  const { trim = false } = options || {}
  const local = writable(get(store))
  const changes = writable([])
  const dirty = writable(false)
  store.subscribe(v => local.set(clone(v)))

  local.subscribe(l => {
    const origin = get(store)
    const clone = get(local)

    if (!origin || !clone) return false // prevent missing comparisons

    let modifications = diff(origin, clone)

    if (trim) {
      modifications = modifications.filter(c => c.op !== 'add' || c.value !== '')
    }

    changes.set(modifications)
  })

  changes.subscribe(c => {
    dirty.set(c.length > 0)
  })

  return {
    local,
    changes,
    dirty,
    revert: (e) => {
      e.preventDefault()
      local.set(clone(get(store)))
    },
  }
}
