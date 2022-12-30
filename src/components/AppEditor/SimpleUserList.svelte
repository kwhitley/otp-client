<script>
  import { autosize } from '~/actions/autosize'

  export let local

  $: {
    // let
  }
</script>

<!-- MARKUP -->
<h3>Simple Login</h3>

<p>
  For simple apps without a dedicated users table/backend, you can just add a list of email
  addresses to the box below.  We'll restrict logins to email addresses found here, and simply
  embed a JWT claim with the email address in the final user token, such as the one below:
</p>

<pre>{`{ email: "foo@bar.com" }`}</pre>

<label>
  <textarea
    type="text"
    placeholder={`foo@bar.com, bar@baz.com`}
    bind:value={$local.users.list}
    use:autosize
    />
</label>

<!-- STYLES -->
<style lang="scss">
</style>
