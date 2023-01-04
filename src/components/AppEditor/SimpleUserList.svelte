<script>
  import { autosize } from '~/actions/autosize'

  export let config
  let local

  $: {
    local = $config.users.list
  }
</script>

<!-- MARKUP -->
<h3>Simple Login</h3>

<p>
  For simple apps without a dedicated users table/backend, you can just add a list of email
  addresses to the box below.  We'll restrict logins to email addresses found here, and simply
  embed a JWT claim with the email address in the final user token.
</p>

<label>
  List of *allowed* email addresses
  <textarea
    type="text"
    placeholder={`foo@bar.com, bar@baz.com`}
    bind:value={$config.users.list}
    use:autosize
    />
</label>

<pre>
{JSON.stringify(local, null, 2)}
</pre>

<!-- STYLES -->
<style lang="scss">
</style>
