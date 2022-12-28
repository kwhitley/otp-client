<script>
  import { goto } from '$app/navigation'
  import { browser } from '$app/environment'
  export let data

  $: {
    if (browser && !data.isLoggedIn) {
      console.log('returning to root...')
      goto('/')
    }
  }
</script>

<slot />
