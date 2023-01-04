<script>
  import { autosize } from '~/actions/autosize'
  import compare from 'just-compare'

  export let items
  export let onChange = v => v
  export let placeholder

  $: asString = items?.join(`,\n`)
  $: asArray = local?.replace(/["]/gi, '')
                .replace(/<[^>]*>/gi, '')
                .split(/[\s,;]+/g)
                .filter(isEmail)
                .sort((a, b) => a > b ? 1 : -1)
  let local = asString

  const isEmail = str => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/.test(str)

  $: if (!compare(asArray, items)) {
    onChange(asArray)
  }

  $: {
    if (local === undefined) {
      local = asString
    }
  }

  const changeHandler = e => {
    console.log('change detected', e)
  }
</script>

<!-- MARKUP -->
<label>
  <slot />

  <textarea
    type="text"
    placeholder={placeholder}
    bind:value={local}
    use:autosize
    />
</label>


<!-- <h3>Local</h3>
<pre>
{JSON.stringify(local, null, 2)}
</pre>

<h3>Array</h3>
<pre>
{JSON.stringify(asArray, null, 2)}
</pre> -->

<!-- STYLES -->
<style lang="scss">
</style>
