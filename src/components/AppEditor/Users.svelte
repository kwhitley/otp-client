<script>
  import { fade, slide } from 'svelte/transition'
  import Toggle from '~/components/Toggle.svelte'
  import SimpleUserList from './SimpleUserList.svelte'
  import UserEndpoints from './UserEndpoints.svelte'

  export let config
</script>

<!-- MARKUP -->
<main in:fade={{ duration: 200 }}>

  <h3>General Settings</h3>

  <Toggle label="Allow Anyone" bind:value={$config.users.allowAnyone} />
  <p class="detail">
    Allows any user with a validated email address to log in.  We'll send the user's email
    within the JWT, if validated.
  </p>

  {#if !$config.users.allowAnyone}
    <section in:slide|config={{ duration: 200 }}>
      <Toggle label="Use Simple Login" bind:value={$config.users.useList} />
      <p class="detail">
        Simple login is the fastest way to get started for simple apps, or apps you merely want to lock down to
        a single/few user(s).  This allows authentication without a dedicated API enpoint for validating users,
        but does not allow you to control the contents of the JWT token, or use non-email identifiers, such as
        usernames.
      </p>
    </section>

    <div in:slide|config={{ duration: 200 }}>
      {#if $config.users.useList}
        <div in:fade|config={{ duration: 200 }}>
          <SimpleUserList config={config} />
        </div>
      {:else}
        <div in:fade|config={{ duration: 200 }}>
          <UserEndpoints config={config} />
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
</style>
