<script>
  import { editable } from '~/utils/editable'
  import { otp } from '~/services/api'
  import Card from '~/components/Card.svelte'
  import { fly } from 'svelte/transition'

  export let app
  export let appID
  let error

  const { changes, dirty, revert, local } = editable(app, { trim: true })

  const onSubmit = (e) => {
    e.preventDefault()

    otp
      .updateApp(appID, $changes)
      .catch(err => {
        error = err.message
      })
  }
</script>

<Card>
  <h2>{$app?.name || appID}</h2>

  <form on:submit={onSubmit}>
    <label>
      Name
      <input
        type="text"
        placeholder="enter an Application Name"
        bind:value={$local.name}
        />
    </label>

    <section class="actions">
      <button type="submit" disabled={!$dirty}>Save Changes</button>
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
    </section>
  </form>
</Card>

<!-- STYLES -->
<style lang="scss">
</style>
