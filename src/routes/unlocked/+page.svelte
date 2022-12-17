<script>
  import { onMount } from 'svelte'
  import { fade, slide } from 'svelte/transition'

  let countdown = 5
  let timer

  const cancelTimer = (e) => {
    e.preventDefault()
    clearInterval(timer)
    timer = undefined
  }

  onMount(() => {
    timer = setInterval(() => {
      countdown--
      if (countdown <= 0) {
        console.log('countdown is zero!')
        clearInterval(timer)
        timer = undefined
        window.close()
      }
    }, 1000)
  })
</script>

<!-- MARKUP -->
<h2>Success!</h2>

<p>
  You should now be logged in to <strong class="app-name">test</strong> in your original window, and this page may be closed at
  any time. Thanks for using OTP Garden!
</p>

{#if timer}
  <p out:slide>This window will close in {countdown} seconds... <a href="/" on:click={cancelTimer}>(cancel)</a></p>
{/if}

<section class="details">
  <p>OTP Garden is trying to solve the authentication experience for developers and users alike.
    Did you like this experience?  If so, consider helping out the team by sharing your thoughts
    on <a href="https://twitter.com/intent/tweet?text=I'm%20loving%20%40otpgarden!">Twitter</a>.
    Your feedback (and the exposure) helps us greatly!</p>
</section>

<style lang="scss">
  .app-name {
    text-transform: capitalize;
  }
</style>
