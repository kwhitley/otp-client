<script>
  import { page } from '$app/stores'
  import { generateHash } from 'supergeneric/generateHash'
  import { fly } from 'svelte/transition'
  import { autofocus } from '~/actions/autofocus'
  import { autosize } from '~/actions/autosize'
  import Card from '~/components/Card.svelte'
  import Copy from '~/components/icons/Copy.svelte'
  import Dice from '~/components/icons/Dice.svelte'
  import Slider from '~/components/Slider.svelte'
  import Tabs from '~/components/Tabs.svelte'
  import Toggle from '~/components/Toggle.svelte'
  import { otp } from '~/services/api'
  import { toast } from '~/services/toast'
  import { editable } from '~/utils/editable'
  import Sessions from './Sessions.svelte'
  import Users from './Users.svelte'

  export let local
</script>

<!-- MARKUP -->
<section class="inputs">
  <label>
    Name
    <input
      type="text"
      placeholder="enter an Application Name"
      bind:value={$local.name}
      use:autofocus
      />
  </label>

  <label>
    Environment
    <input
      type="text"
      placeholder="e.g. production"
      bind:value={$local.environment}
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
