<script>
  import { goto } from '$app/navigation'
  import { onMount, onDestroy } from 'svelte'
  import { navlink } from 'svelte-navlink-action'
  import { flip } from 'svelte/animate'
  import { otp } from '~/services/api'
  import { app, apps } from '~/stores'
  import AppsList from './AppsList.svelte'

  const createApp = () => otp.createApp()
                            .then(({ id }) => goto(`/apps/${id}`))

  $: hasNew = $apps.find?.(a => !a.name)

  // onMount(otp.getApps)
  onDestroy(() => {
    $app = undefined
  })
</script>

<!-- MARKUP -->
<main class="split">
  <section class="menu">
    <AppsList apps={$apps} />

    <button
      on:click={createApp}
      disabled={hasNew}
      >
      {#if hasNew}
        Name your app to continue
      {:else}
        Create an App
      {/if}
    </button>
  </section>

  <section class="app-editor">
      {#if $app}
        <h2>App
          : {$app.name || 'Unititled App'}
          {#if $app.environment}
            <small class="badge">{$app.environment}</small>
          {/if}
        </h2>
      {:else}
        <section class="centered">
          It looks like you don't have any apps yet.  <a on:click={createApp}>Create one</a> to get started!
        </section>
      {/if}
    <slot />
  </section>
</main>

<!-- STLYES -->
<style lang="scss">
  main {
    gap: 3rem;
    z-index: 1;

    & > * {
      flex: 4;
    }

    & > *:first-child {
      flex: 1;
      min-width: 13em;
    }
  }

  .menu {
    button {
      margin-top: 2rem;
    }
  }

  .list-of-apps {
    display: flex;
    flex-flow: column;
    gap: 0.2rem;
  }

  .app-entry {
    color: var(--foreground-color);
    background-color: var(--foreground-5);
    padding: 0.8rem;
    display: flex;
    flex-flow: column;
    align-items: flex-start;

    &:hover {
      text-decoration: none;
      background-color: var(--foreground-10);
    }

    small {
      font-weight: 100;
      font-size: 0.8rem;
      margin-top: 0.1rem;
      display: flex;
      color: var(--foreground-25);
    }
  }

  .app-editor {
    min-width: 20em;
  }

  :global(.app-entry.active:not(#foo)) {
    pointer-events: none;
    background-color: var(--foreground-25);
  }

  h2 {
    margin-bottom: 1.5rem;

    a {
      color: var(--foreground-color);

      &:hover {
        color: var(--link-color);
        text-decoration: none;
      }
    }
  }
</style>
