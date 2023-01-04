<script>
  import { autofocus } from '~/actions/autofocus'
  import { fade } from 'svelte/transition'

  export let config
</script>

<!-- MARKUP -->
<section class="inputs" in:fade={{ duration: 200 }}>
  <label>
    Name
    <input
      type="text"
      placeholder="enter an Application Name"
      bind:value={$config.name}
      use:autofocus
      />
  </label>

  <label>
    Environment
    <input
      type="text"
      placeholder="e.g. production"
      bind:value={$config.environment}
      />
  </label>
</section>

<!-- STYLES -->
<style lang="scss">
  h3 {
    margin-bottom: 1rem;
  }

  form {
    display: flex;
    flex-flow: column;
  }

  form .actions {
    margin-top: 0;
    margin-bottom: 1.5em;
  }

  .icon {
    color: var(--foreground-color);
    height: 1.4rem;
    width: 1.4rem;
    opacity: 0.7;
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
      opacity: 1;
    }
  }

  .secret {
    display: flex;
    justify-content: stretch;
    align-items: flex-start;
    gap: 0.6rem;

    textarea {
      flex: 1;
    }

    .icon-actions {
      display: flex;
      flex-flow: column;
      flex: 0;
      gap: 0.3rem;
    }
  }
</style>
