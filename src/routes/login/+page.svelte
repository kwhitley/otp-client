<script>
  import { goto } from '$app/navigation'
  import { cancel, state, login } from '~/services/auth'
  import Card from '~/components/Card.svelte'
  import ActionInput from '~/components/ActionInput.svelte'
  import { toast } from '~/services/toast'

  let value = ''
  let INITIAL_BUTTON_TEXT = 'Go'
  let buttonText = INITIAL_BUTTON_TEXT
  let error

  const onSubmit = (e) => {
    e.preventDefault()
    console.log('submitting form with value', value)
    // value = ''

    login(value)
      .then(() => goto('/apps'))
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
</script>

<!-- MARKUP -->
<main class="outer">
  <div class="inner">
    <h2>Log In</h2>

    <p>
      Enter your username or email address.
      If we find you, we'll send you a login email to complete the process.
    </p>

    <ActionInput
      bind:value={value}
      shake={error}
      placeholder="username or email"
      buttonText={buttonText}
      on:submit={onSubmit}
      disabled={$state.waiting}
      />

    {#if $state.waiting}
      <p>
        Waiting for email confirmation... or
        <a on:click={cancel}>cancel</a> to try again.
      </p>
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
</style>
