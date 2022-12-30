<script>
  import { generateHash } from 'supergeneric/generateHash'
  import { autosize } from '~/actions/autosize'
  import Card from '~/components/Card.svelte'
  import Copy from '~/components/icons/Copy.svelte'
  import Dice from '~/components/icons/Dice.svelte'
  import Toggle from '~/components/Toggle.svelte'
  import { toast } from '~/services/toast'

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
  body: JSON.stringify({
    id: "stray@kitty.com" // this can be any identifier
  }),
})
`

$: fetchExampleWithResponse = `${fetchExample}

// EXAMPLE RESPONSE: User Found
200 {
  email: "stray@kitty.com",
  claims: {
    email: "stray@kitty.com",
    displayName: "Halsey"
  }
}

// EXAMPLE RESPONSE: User Not Found/Not Allowed
404 User not found
`

const examplePayload = `{
  email: "stray@kitty.com", // used for login,
  claims: {
    whatever: "you put here",
    will: "be added to user JWT tokens",
  }
}`
</script>

<!-- MARKUP -->
<h3>User Endpoints</h3>

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
  If this user is not in your system (or not allowed), send any error at all to abort the
  login process (an email will not be sent).
</p>

<p>
  Please note, we attach your OTP Garden API key as the header <strong>otpg-api-key</strong>
  when talking to your API.
  Please ensure this key is present/matches on any requests to your API endpoint!</p>
<pre class="code">{fetchExampleWithResponse}</pre>

<p>
  If the user <strong>IS </strong> valid, please respond with JSON in the following format.
  All data is fully encrypted at rest on OTP Garden, and will be destroyed automatically if
  the user fails to validate the session.
</p>

<ul>
  <li>
    <p>
      <strong>email</strong> is required for us to contact the user for login.  We never even
      store this value.
    </p>
  </li>
  <li>
    <p>
      <strong>claims</strong> will be embedded in the JWT tokens sent to the user, and available to client
      code on the application, as well as via any authenticated requests to your backend.
    </p>
  </li>
</ul>

<pre>{examplePayload}</pre>

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
    // font-size: 0.9rem;
  }
</style>
