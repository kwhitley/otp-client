<script>
  import { fly } from 'svelte/transition'
  import { autofocus } from '~/actions/autofocus'
  import { autosize } from '~/actions/autosize'
  import Card from '~/components/Card.svelte'
  import Slider from '~/components/Slider.svelte'
  import { otp } from '~/services/api'
  import { editable } from '~/utils/editable'

  export let app
  export let appID
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
</script>

<!-- MARKUP -->
<form on:submit={onSubmit}>
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


  <h3>Endpoints</h3>

  <section class="split flexed">
    <Card dim={!$local.endpoints?.getUser?.url}>
      <h3>Get User/Validate</h3>

      <section class="inputs">
        <label>
          <textarea
            type="text"
            placeholder="e.g. https://foo.bar/validate/user"
            bind:value={$local.endpoints.getUser.url}
            use:autosize
            />
        </label>

        <label>
          HTTP Method
          <input
            type="text"
            placeholder="POST"
            bind:value={$local.endpoints.createUser.method}
            />
        </label>
      </section>
    </Card>

    <Card dim={!$local.endpoints?.createUser?.url}>
      <h3>Create User</h3>

      <section class="inputs">
        <label>
          <textarea
            type="text"
            placeholder="e.g. https://foo.bar/users"
            bind:value={$local.endpoints.createUser.url}
            use:autosize
            />
        </label>

        <label>
          HTTP Method
          <input
            type="text"
            placeholder="POST"
            bind:value={$local.endpoints.createUser.method}
            />
        </label>
      </section>
    </Card>
  </section>

  <h3>Secrets</h3>

  <section class="inputs">
    <label>
      OTP Garden API Key
      <textarea
        type="text"
        placeholder="enter a custom secret or roll a new one"
        bind:value={$local.keys.api}
        use:autosize
        />
    </label>

    <label>
      JWT Secret (signature)
      <textarea
        type="text"
        placeholder="enter a custom secret or roll a new one"
        bind:value={$local.keys.tokenSecret}
        use:autosize
        />
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
    bind:value={$local.durations.session}
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
</form>
<!--
<pre>
  {JSON.stringify($local, null, 2)}
</pre> -->

<!-- STYLES -->
<style lang="scss">
  h3 {
    margin-bottom: 1rem;
  }

  form {
    display: flex;
    flex-flow: column;
  }
</style>
