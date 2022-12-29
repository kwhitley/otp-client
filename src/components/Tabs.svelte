<script>
  import { navlink } from 'svelte-navlink-action'

  export let items
</script>

<!-- MARKUP -->
<section class="tabs">
  {#each items as { label, path }}
    <a href={path} use:navlink>{label}</a>
  {/each}
</section>


<!-- STYLES -->
<style lang="scss">
  :root {
    --tabs-line-thickness: 4px;
  }

  .tabs {
    display: flex;
    flex-flow: row wrap;
    border-bottom: var(--tabs-line-thickness) solid var(--foreground-25);
    margin-top: 1em;
    margin-bottom: 2rem;
    font-size: 1.2rem;
    align-items: flex-end;
    min-height: 3.2em;
  }

  :global(.tabs > a) {
    padding: 0.7rem 1.5rem 0.6rem;
    color: var(--foreground-50);
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    transition: all 0.1s linear;
  }

  :global(.tabs > a:hover) {
    text-decoration: none;
    color: var(--foreground-color);
  }

  :global(.tabs > a.active) {
    color: var(--foreground-color);
    border-bottom: var(--tabs-line-thickness) solid var(--foreground-color);
    border-bottom: var(--tabs-line-thickness) solid var(--accent-color);
    margin-bottom: calc(-1 * var(--tabs-line-thickness));
    font-size: 1.5em;
  }
</style>
