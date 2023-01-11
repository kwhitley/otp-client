<script>
  import { goto } from '$app/navigation'
  import { cancel, waiting, login, sendCode, session } from '~/services/auth'
  import Card from '~/components/Card.svelte'
  import ActionInput from '~/components/ActionInput.svelte'
  import { toast } from '~/services/toast'

  let value = ''
  let INITIAL_BUTTON_TEXT = 'Go'
  let buttonText = INITIAL_BUTTON_TEXT
  let error
  let code

  $: if ($session.isLoggedIn) {
    goto('/apps')
  }

  const submitEmail = (e) => {
    e.preventDefault()
    console.log('submitting form with value', value)
    // value = ''

    login(value)
      .catch(err => {
        if (!err) return // skip for non-error rejections, like a login cancellation

        console.log('there was an error during login', err)
        error = true
        toast(`I'm sorry, but we couldn't find you in our system!`, { type: 'error', duration: '2 seconds' })

        setTimeout(() => {
          error = false
        }, 2000)
      })
  }

  const submitCode = (e) => {
    e.preventDefault()

    sendCode(code)
      .catch(err => {
        error = true
        code = ''
        toast(`That's not the code we're looking for.  Try again?`, { type: 'error', duration: '2 seconds' })

        setTimeout(() => error = false, 1000)
      })
  }
</script>

<!-- MARKUP -->
<main class="outer">
  <div class="inner">
    <h2>Log In</h2>

    <p>
      Enter your username or email address.
      If we find you, we'll send you a login email to complete the process.
    </p>


    {#if $waiting}
      <p>An unlock code should have been sent to your email.  Please enter that code here or click on the link within the email:</p>
      <form
        class="code-form"
        class:shaking={error}
        on:submit={submitCode}
        >
        <input
          class="code"
          type="text"
          maxlength="4"
          size="4"
          bind:value={code}
          placeholder="- - - -"
          />
      </form>

      <p>
        Waiting for email confirmation... or
        <a on:click={cancel}>cancel</a> to try again.
      </p>
    {:else}
      <ActionInput
        bind:value={value}
        shake={error}
        placeholder="username or email"
        buttonText={buttonText}
        on:submit={submitEmail}
        disabled={$waiting}
        />
    {/if}
  </div>
</main>

<!-- STYLES -->
<style lang="scss">
  .outer {
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
    margin-top: 5rem;
  }

  .inner {
    flex: 1;
    max-width: 30em;
    margin-left: auto;
    margin-right: auto;
  }

  .code {
    font-size: 6rem;
    text-transform: uppercase;
    width: 3.7em;
    letter-spacing: 0.05em;
    text-align: center;
    padding: 0.15em;
    line-height: 1em;
    margin-bottom: 2rem;
    color: var(--blue);
  }

  .code-form {
    display: flex;
    justify-content: center;
    padding: 1em;
  }
</style>
