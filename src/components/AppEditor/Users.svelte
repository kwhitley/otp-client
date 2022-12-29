<script>
  import { generateHash } from 'supergeneric/generateHash'
  import { fly } from 'svelte/transition'
  import { autofocus } from '~/actions/autofocus'
  import { autosize } from '~/actions/autosize'
  import Card from '~/components/Card.svelte'
  import Copy from '~/components/icons/Copy.svelte'
  import Dice from '~/components/icons/Dice.svelte'
  import Slider from '~/components/Slider.svelte'
  import { otp } from '~/services/api'
  import { toast } from '~/services/toast'
  import { editable } from '~/utils/editable'
  import Toggle from '~/components/Toggle.svelte'
  import Tabs from '~/components/Tabs.svelte'

  export let local

  const reroll = () => generateHash(128)

  const copyToClipboard = async (e, value) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(value)

    toast(`Copied key to clipboard.`, { duration: '2 seconds' })
  }

  $: fetchExample = $local.users.endpoints.getUser.method === 'GET'
  ? `fetch("${$local.users.endpoints.getUser.url}?id=foo@bar.com", {
  headers: {
    "otpg-api-key": "${$local.keys.api.slice(0, 30)}...", // abbreviated
  }
})
`
  : `fetch("${$local.users.endpoints.getUser.url}", {
  method: "${$local.users.endpoints.getUser.method}",
  headers: {
    "content-type": "application/json",
    "otpg-api-key": "${$local.keys.api.slice(0, 30)}...", // abbreviated
  },
  body: JSON.stringify({ id: "foo@bar.com" }),
})
`
</script>

<!-- MARKUP -->
<Toggle label="Simple User List" bind:value={$local.users.allowAnyone} />

<h3>Endpoints</h3>

<section class="endpoints split flexed">
  <Card dim={!$local.users.endpoints?.getUser?.url}>
    <h3>Get User/Validate</h3>

    <section class="inputs">
      <label>
        <textarea
          type="text"
          placeholder="e.g. https://foo.bar/validate/user"
          bind:value={$local.users.endpoints.getUser.url}
          use:autosize
          />
      </label>

      <label>
        HTTP Method
        <input
          type="text"
          placeholder="POST"
          bind:value={$local.users.endpoints.getUser.method}
          />
      </label>
    </section>
  </Card>

  <!-- <Card dim={!$local.users.endpoints?.createUser?.url}>
    <h3>Create User</h3>

    <section class="inputs">
      <label>
        <textarea
          type="text"
          placeholder="e.g. https://foo.bar/users"
          bind:value={$local.users.endpoints.createUser.url}
          use:autosize
          />
      </label>

      <label>
        HTTP Method
        <input
          type="text"
          placeholder="POST"
          bind:value={$local.users.endpoints.createUser.method}
          />
      </label>
    </section>
  </Card> -->
</section>

<label>
  OTP Garden API Key
  <div class="secret">
    <textarea
      type="text"
      placeholder="enter a custom secret or roll a new one"
      bind:value={$local.keys.api}
      use:autosize
      />
    <div class="icon-actions">
      <div
        class="icon"
        title="Generate a new value"
        on:click={() => $local.keys.api = reroll()}
        >
        <Dice />
      </div>
      <div
        class="icon"
        title="Copy to clipboard"
        on:click={(e) => copyToClipboard(e, $local.keys.api)}
        >
        <Copy />
      </div>
    </div>
  </div>
</label>

<h3>Example</h3>
<p>
  This is an example call of what we'll send your endpoint during user logins.
</p>
<p>
  Please note, we attach your OTP Garden API key as the header <strong>otpg-api-key</strong>.
  Please ensure this key is present/matches on any requests to your API endpoint!</p>
<pre class="code">{fetchExample}</pre>

<!-- STYLES -->
<style lang="scss">
  h3 {
    margin-bottom: 1rem;
  }

  form {
    display: flex;
    flex-flow: column;
  }

  .endpoints {
    margin-bottom: 1.5rem;
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

  pre {
    margin-top: 0;
    border-radius: var(--border-radius);
    border: var(--border-thickness) solid var(--foreground-color);
    background-color: var(--foreground-5);
    padding: 1.5rem;
    font-size: 0.9rem;
    white-space: pre-wrap;
    overflow: scroll;
  }

  strong {
    color: var(--white);
  }
</style>
