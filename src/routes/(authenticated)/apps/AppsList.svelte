<script>
  import { navlink } from 'svelte-navlink-action'
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'

  export let apps

  $: sorted = [...apps].sort((a, b) =>
    a.name + a.environment > b.name + b.environment ? 1 : -1
  )

  // $: console.log('unsorted apps are', apps)
  $: console.log('sorted apps are', sorted)
</script>

<!-- MARKUP -->
{#if apps?.length}
  <div transition:fade={{ duration: 200 }} class="list-of-apps">
    {#each sorted as app, index(app.id)}
      <a
        class="app-entry"
        href={`/apps/${app.id}`}
        animate:flip={{ duration: 200 }}
        use:navlink
        >
        {app.name || 'Untitled App'}

        {#if app.environment}
          <small>{app.environment}</small>
        {/if}
      </a>
    {/each}
  </div>
{:else}
  <p>You currently have no apps.</p>
{/if}

<!-- STLYES -->
<style lang="scss">
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

  :global(.app-entry.active:not(#foo)) {
    pointer-events: none;
    background-color: var(--foreground-25);
  }
</style>
