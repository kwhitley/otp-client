<script>
  import { goto } from '$app/navigation'
  import { browser } from '$app/environment'
  import { session } from '~/services/auth'

  $: {
    if (browser && !$session.isLoggedIn) {
      console.log('returning to root...')
      goto('/')
    }
  }
</script>

<slot />
