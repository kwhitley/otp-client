<script>
  import { fly } from 'svelte/transition'
  import Card from '~/components/Card.svelte'
  import { itty } from '~/services/api'
  import { profile } from '~/stores'
  import { editable } from '~/utils/editable'

  let error
  let { changes, dirty, local, revert } = editable(profile, { trim: true })

  const onSubmit = (e) => {
    e.preventDefault()

    itty
      .updateProfile(changes)
      .then(profile.set)
      .catch(err => {
        error = err.message
      })
  }
</script>

<!-- MARKUP -->
{#if error}
  <p>{error}</p>
{/if}

{#if $profile}
  <Card>
    <h3>Profile</h3>

    <p>
      This is fetched from an external endpoint requiring JWT authentication (token delivered by OTP Garden via the ongoing session).
      The JSON below is just some makeshift payload for the sake of demonstration, but pulled directly from the API.
    </p>

    <form on:submit={onSubmit}>
      <label>
        Name
        <input type="text" bind:value={$local.name} />
      </label>

      <label>
        Email
        <input type="text" bind:value={$local.email} disabled />
      </label>

      <label>
        Phone Number (SMS)
        <input type="text" bind:value={$local.sms} />
      </label>

      <section class="actions">
        {#if $dirty}
          <button
            class="secondary"
            in:fly={{ x: 50, duration: 200 }}
            out:fly={{ x: -200, duration: 200 }}
            on:click={revert}
            >
            Cancel
          </button>
        {/if}
        <button type="submit" disabled={!$dirty}>Save Changes</button>
      </section>
    </form>
  </Card>

  <h3>Original</h3>
  <pre>
{JSON.stringify($profile, null, 2)}
  </pre>

  <h3>Local</h3>
  <pre>
{JSON.stringify($local, null, 2)}
  </pre>

  <h3>Changes</h3>
  <pre>
{JSON.stringify($changes, null, 2)}
  </pre>
{/if}

<!-- STLYES -->
<style lang="scss">

</style>
