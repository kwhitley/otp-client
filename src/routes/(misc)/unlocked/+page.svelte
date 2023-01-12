<script>
  import { onMount, onDestroy } from 'svelte'
  import { fade, slide } from 'svelte/transition'
  import { Confetti } from 'svelte-confetti'
  import '~/styles/app.scss'

  let countdown = 10
  let timer = true

  const cancelTimer = (e) => {
    e.preventDefault()
    clearInterval(timer)
    timer = undefined
  }

  onMount(() => {
    console.log('mounting...')
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

  onDestroy(() => {
    clearInterval(timer)
  })
</script>

<!-- MARKUP -->
<main>
  <h1>Success!</h1>

  <p>
    You should now be logged in within your original window, and this page may be closed at
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

  <section class="confetti-origin">
    <Confetti
      amount={500}
      size={7}
      x={[-4, 4]}
      y={[-4, 10]}
      delay={[0, 200]}
      xSpread=0.1
      colorArray={[
        'white',
        'white',
        'white',
        'var(--blue)',
        'magenta',
      ]}
      fallDistance="5vh"
      />
  </section>
</main>


<style lang="scss">
  .app-name {
    text-transform: capitalize;
  }


  main {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    height: 80%;
    padding: 3em;
    max-height: 100vh;
    flex: 1;

    & > * {
      max-width: 500px;
    }
  }

  .confetti-origin {
    position: fixed;
    bottom: -10em;
    margin-left: -20em;
  }

  .details {
    background-color: var(--foreground-5);
    padding: 2em;
    border-radius: var(--border-radius);
    color: var(--foreground-75);
  }
</style>
