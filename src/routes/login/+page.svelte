<script>
  import { goto } from '$app/navigation'
  import * as auth from '~/services/auth'
  import Card from '~/components/Card.svelte'
  import SearchInput from '~/components/SearchInput.svelte'

  const { user, state } = auth
  let value = ''
  let INITIAL_BUTTON_TEXT = 'Go'
  let buttonText = INITIAL_BUTTON_TEXT

  const onSubmit = (e) => {
    e.preventDefault()
    console.log('submitting form with value', value)
    // value = ''

    auth
      .login(value)
      .then(() => goto('/apps'))
  }
</script>

<!-- MARKUP -->
<h2>Log In</h2>

<br />

<SearchInput
  bind:value={value}
  placeholder="username or email"
  buttonText={buttonText}
  on:submit={onSubmit}
  disabled={$state.waiting}
  />

{#if $state.waiting}
  <p>Waiting for email confirmation...</p>
{/if}
