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

  export let app
  export let appID

  $: editorPage = new URL($page.url)?.search.replace(/^\?/, '')

  $: console.log('editor page is', editorPage)
  let error

  const { changes, dirty, revert, local } = editable(app, { trim: true })

  const onSubmit = (e) => {
    e.preventDefault()

    otp
      .updateApp(appID, $changes)
      .catch(err => {
        error = err.message
      })
  }

  const reroll = () => generateHash(128)

  const copyToClipboard = async (e, value) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(value)

    toast(`Copied key to clipboard.`, { duration: '2 seconds' })
  }
</script>

<!-- MARKUP -->
<form on:submit={onSubmit}>
  <section class="actions">
    <button type="submit" disabled={!$dirty}>Save Changes</button>
    {#if $dirty}
      <button
        class="secondary"
        in:fly={{ x: 50, duration: 200 }}
        out:fly={{ x: -200, duration: 200 }}
        on:click={revert}
        >
        Cancel
      </button>
    {/if}
  </section>

  <section class="split">
    <label>
      Name
      <input
        type="text"
        placeholder="enter an Application Name"
        bind:value={$local.name}
        use:autofocus={appID}
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


  <Tabs items={[
    { label: 'Users', path: '?users' },
    { label: 'Tokens & Sessions', path: '?sessions' },
    ]} />




  {#if editorPage === 'users'}
    <Users local={local} />
  {/if}

  {#if editorPage === 'sessions'}
    <Sessions local={local} />
  {/if}

  <!-- <Toggle label="Simple User List" bind:value={$local.users.allowAnyone} />

  <h3>Endpoints</h3>

  <section class="split flexed">
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
            bind:value={$local.users.endpoints.createUser.method}
            />
        </label>
      </section>
    </Card>

    <Card dim={!$local.users.endpoints?.createUser?.url}>
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
    </Card>
  </section>

  <h3>Secrets</h3>

  <section class="inputs">
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
  </section>

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
 -->

</form>

<pre>
  {JSON.stringify($changes, null, 2)}
</pre>

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
