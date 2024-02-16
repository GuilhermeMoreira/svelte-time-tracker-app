import { onMount, onDestroy } from 'svelte'
import { writable } from 'svelte/store'

export function subscribe() {
  const store = writable(`...page load`)
  let unsubscribe = undefined
  onMount(async () => {
    unsubscribe = store.subscribe(content => {
      // console.log('Montou...')
      // console.log('...Subscribe', content)
    })
  })
  onDestroy(async () => {
    unsubscribe()
  })
  return store
}