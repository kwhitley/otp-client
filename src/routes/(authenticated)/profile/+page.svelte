<script>
  import { onMount } from 'svelte'
  import * as auth from '~/services/auth'
  import { profile } from '~/stores'
  import clone from 'just-clone'
  import Card from '~/components/Card.svelte'
  import compare from 'just-compare'
  import { diff } from 'just-diff'
  import { itty } from '~/services/api'
  import { fly } from 'svelte/transition'

  let api
  let error
  let local = {}

  profile.subscribe(p => {
    local = clone(p)
  })

  $: dirty = !compare($profile, local)
  $: changes = diff($profile, local)

  // removes added, then deleted keys for proper dirty checking
  $: {
    for (const key in local) {
      if (local[key] === '') {
        Reflect.deleteProperty(local, key)
        local = local
      }
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()

    itty
      .updateProfile(changes)
      .then(profile.set)
  }

  const revert = () => {
    local = clone($profile)
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
        <input type="text" bind:value={local.name} />
      </label>

      <label>
        Email
        <input type="text" bind:value={local.email} disabled />
      </label>

      <label>
        Phone Number (SMS)
        <input type="text" bind:value={local.sms} />
      </label>

      <section class="actions">
        {#if dirty}
          <button
            class="secondary"
            in:fly={{ x: 50, duration: 200 }}
            out:fly={{ x: -200, duration: 200 }}
            on:click={revert}
            >
            Cancel
          </button>
        {/if}
        <button type="submit" disabled={!dirty}>Save Changes</button>
      </section>
    </form>
  </Card>

  <pre>
{JSON.stringify(local, null, 2)}
  </pre>

  <h3>Changes</h3>
  <pre>
{JSON.stringify(changes, null, 2)}
  </pre>
{/if}

<!-- STLYES -->
<style lang="scss">

</style>
