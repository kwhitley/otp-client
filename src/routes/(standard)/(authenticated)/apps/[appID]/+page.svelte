<script>
  import AppEditor from '~/components/AppEditor/index.svelte'
  import { app } from '~/stores'

  export let data
  const { appID } = data
</script>

<!-- MARKUP -->

{#if $app}
  <AppEditor
    app={app}
    appID={data.appID}
    />

  <!-- <pre>
    {JSON.stringify($app, null, 2)}
  </pre> -->
{:else}
  <p>Loading app...</p>
{/if}

<!-- STLYES -->
<style lang="scss">

</style>
