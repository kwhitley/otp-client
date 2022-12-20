<script>
  export let data

  $: {
    if (!data.isLoggedIn) {
      console.log('returning to root...')
    }
  }
</script>

<slot />
