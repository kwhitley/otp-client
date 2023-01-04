<script>
  import Badge from './Badge.svelte'
</script>

<!-- MARKUP -->
<small class="badge optional">
  optional
</small>

<!-- STYLES -->
<style lang="scss">
  .optional {
    font-size: 0.6rem;
    letter-spacing: 0.05em;
    background-color: var(--foreground-50);
    padding: var(--vertical-padding) calc(var(--vertical-padding) * 2);
  }
</style>
