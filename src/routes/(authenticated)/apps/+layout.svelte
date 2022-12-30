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

        <slot />
      {/if}

      {#if !$apps.length}
        <section class="centered">
          <p>It looks like you don't have any apps yet. <a on:click={createApp}>Create one</a> to get started!</p>
        </section>
      {/if}
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

  .app-editor {
    min-width: 20em;
  }

  :global(.app-entry.active:not(#foo)) {
    pointer-events: none;
    background-color: var(--foreground-25);
  }
</style>
