<script>
  import { autosize } from '~/actions/autosize'
  import EmailList from '~/components/EmailList.svelte'
  import compare from 'just-compare'

  export let config
  let local = `kevin@gmail.com, foo@bar.com, <Wahtever>whatever.else@gmail.com, "something@inquotes.com"`
  let items = [
    'krwhitley@gmail.com',
    'foo@bar.com'
  ]

  // const isEmail = str => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/.test(str)

  // $: asArray = local?.replace(/["]/gi, '')
  //               .replace(/<[^>]*>/gi, '')
  //               .split(/\s*[,]\s*/g)
  //               .filter(isEmail)

  // $: if (!compare(asArray, $config.users.list)) {
  //   console.log('user list not equal', {
  //     existing: $config.users.list,
  //     local,
  //     asArray,
  //   })
  //   // local = $config.users.list?.join(`,\n`)
  // }
</script>

<!-- MARKUP -->
<h3>Simple Login</h3>

<p>
  For simple apps without a dedicated users table/backend, you can just add a list of email
  addresses to the box below.  We'll restrict logins to email addresses found here, and simply
  embed a JWT claim with the email address in the final user token.
</p>

<p>
  We support a wide variety of email list formats, so paste away!
</p>

<EmailList
  items={$config.users.list}
  onChange={(v) => $config.users.list = v}
  placeholder="e.g. foo@bar.com, mittens@kittens.com, etc."
  >
  Allow the following
  {$config.users.list.length || ''}
  users:
</EmailList>

<!-- STYLES -->
<style lang="scss">
</style>
