<script>
  import VersionBadge from './VersionBadge.svelte'
  import Logo from './Logo.svelte'
</script>

<!-- MARKUP -->
  <a class="brand" href="/">
    <Logo />
    <strong class="alpha">
      <VersionBadge type="alpha" />
    </strong>
    <div class="tagline">dead-simple authentication</div>
  </a>

<!-- STYLES -->
<style lang="scss">
  .brand {
    align-self: center;
    padding: 0.15rem 0 0.6rem;
    font-size: clamp(1.6rem, 6vw, 2.5rem);
    display: flex;
    column-gap: 0.1em;
    flex-flow: row wrap;
  }

  .tagline {
    flex: 1 100%;
    font-size: 0.33em;
    letter-spacing: -0.02em;
    color: var(--foreground-50);
    margin-top: -0.25em;
    font-weight: 200;
    z-index: 2;
    font-family: sans-serif;
  }

  a {
    font-size: var(--brand-size);
    letter-spacing: -0.05em;
    transition: color 0.2s ease;
    display: inline-block;
    transform-origin: 0% 50%;

    &:hover {
      text-decoration: none;
      opacity: 0.8;
    }
  }
</style>
