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
  import Users from './Users.svelte'

  export let local

  const reroll = () => generateHash(128)

  const copyToClipboard = async (e, value) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(value)

    toast(`Copied key to clipboard.`, { duration: '2 seconds' })
  }
</script>

<!-- MARKUP -->

  <label>
    JWT Secret (signature)
    <div class="secret">
      <textarea
        type="text"
        placeholder="enter a custom secret or roll a new one"
        bind:value={$local.keys.tokenSecret}
        use:autosize
        />
      <div class="icon-actions">
        <div
          class="icon"
          title="Generate a new value"
          on:click={() => $local.keys.tokenSecret = reroll()}
          >
          <Dice />
        </div>
        <div
          class="icon"
          title="Copy to clipboard"
          on:click={(e) => copyToClipboard(e, $local.keys.tokenSecret)}
          >
          <Copy />
        </div>
      </div>
    </div>
  </label>

  <h3>Durations</h3>

  <Slider
    label="User has"
    afterLabel="to unlock session"
    bind:value={$local.durations.login}
    options={[
      '1 minute',
      '5 minutes',
      '15 minutes',
    ]}
    />

  <Slider
    label="JWT tokens last"
    bind:value={$local.durations.token}
    options={[
      '1 minute',
      '5 minutes',
      '15 minutes',
      '30 minutes',
      '1 hour',
    ]}
    />

  <Slider
    label="Users can reconnect within"
    bind:value={$local.durations.session}
    options={[
      '5 minutes',
      '15 minutes',
      '30 minutes',
      '1 hour',
      '12 hours',
      '1 day',
      '1 week',
    ]}
    />

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
