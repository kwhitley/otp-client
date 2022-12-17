<script>
  import { navlink } from 'svelte-navlink-action'

  export let initial = '?'
</script>

<!-- MARKUP -->
<a class="avatar" href="/profile" use:navlink>
  {initial?.toUpperCase()}
</a>

<!-- STYLES -->
<style lang="scss">
  .avatar {
    text-decoration: none;
    background-color: var(--foreground-color);
    color: var(--background-color);
    border-radius: 1em;
    display: flex;
    height: 1.75rem;
    width: 1.75rem;
    font-size: 1.3rem;
    justify-content: center;
    align-items: center;
    line-height: 0;
    font-weight: bold;
    cursor: pointer;
  }

  .avatar:global(.active) {
    border-bottom: none;
    background-color: var(--link-color);
  }
</style>
