<script>
  import { onMount } from 'svelte'
  import { navlink } from 'svelte-navlink-action'
  import { flip } from 'svelte/animate'
  import { otp } from '~/services/api'
  import { apps } from '~/stores'

  const createApp = otp.createApp

  onMount(otp.getApps)
</script>

<!-- MARKUP -->
<h2>Apps</h2>
<main class="split">
  <section class="menu">
    {#if $apps?.length}
      <div class="list-of-apps">
        {#each $apps as app, index(app.id)}
          <a
            class="app-entry"
            href={`/apps/${app.id}`}
            animate:flip={{ duration: 200 }}
            use:navlink
            >
            {app.name || 'Untitled App'}

            <small>{app.id}</small>
          </a>
        {/each}
      </div>
    {:else}
      <p>You currently have no apps.</p>
    {/if}

    <button on:click={createApp}>Create an App</button>
  </section>

  <section class="app-editor">
    <slot />
  </section>
</main>

<!-- STLYES -->
<style lang="scss">
  main {
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
    overflow: hidden;

  }

  :global(.app-entry.active:not(#foo)) {
    pointer-events: none;
    background-color: var(--foreground-25);
  }
</style>
