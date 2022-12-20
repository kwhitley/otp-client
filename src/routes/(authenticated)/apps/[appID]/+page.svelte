<script>
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { otp } from '~/services/api'
  import { apps, app } from '~/stores'
  import { navlink } from 'svelte-navlink-action'
  import { writable } from 'svelte/store'
	import AppEditor from '~/routes/(authenticated)/apps/[appID]/AppEditor.svelte'

  export let data
  const { appID } = data

  $: {
    console.log(`loading app ${appID}`)
    // otp.getApp(data.appID)
  }
</script>

<!-- MARKUP -->

{#if $app}
  <AppEditor app={app} appID={data.appID} />

  <pre>
    {JSON.stringify($app, null, 2)}
  </pre>
{:else}
  <p>Loading app...</p>
{/if}

<!-- STLYES -->
<style lang="scss">

</style>
