<script>
  import { fade, slide } from 'svelte/transition'
  import Toggle from '~/components/Toggle.svelte'
  import SimpleUserList from './SimpleUserList.svelte'
  import UserEndpoints from './UserEndpoints.svelte'

  export let local
</script>

<!-- MARKUP -->
<main in:fade={{ duration: 200 }}>

  <h3>General Settings</h3>

  <Toggle label="Allow Anyone" bind:value={$local.users.allowAnyone} />
  <p class="detail">
    Allows any user with a validated email address to log in.  We'll send the user's email
    within the JWT, if validated.
  </p>

  {#if !$local.users.allowAnyone}
    <section in:slide|local={{ duration: 200 }}>
      <Toggle label="Use Simple Login" bind:value={$local.users.useList} />
      <p class="detail">
        Simple login is the fastest way to get started for simple apps, or apps you merely want to lock down to
        a single/few user(s).  This allows authentication without a dedicated API enpoint for validating users,
        but does not allow you to control the contents of the JWT token, or use non-email identifiers, such as
        usernames.
      </p>
    </section>

    <div in:slide|local={{ duration: 200 }}>
      {#if $local.users.useList}
        <div in:fade|local={{ duration: 200 }}>
          <SimpleUserList local={local} />
        </div>
      {:else}
        <div in:fade|local={{ duration: 200 }}>
          <UserEndpoints local={local} />
        </div>
      {/if}
    </div>
  {/if}

</main>

<!-- STYLES -->
<style lang="scss">
  section {
    padding-bottom: 2rem;
  }

  .detail {
    padding: 0.5em;
    font-size: 1rem;
  }
</style>
