<script>
  import { onMount } from 'svelte'
  import { navlink } from 'svelte-navlink-action'
  import Avatar from '~/layout/Avatar.svelte'
  import { itty } from '~/services/api'
  import { session } from '~/services/auth'
  import { profile } from '~/stores'

  onMount(() => {
    itty.getProfile()
      .then(results => { $profile = results })
      .catch(err => console.error(err.message))
  })
</script>

<!-- MARKUP -->
{#if $session.isLoggedIn}
  <a href="/apps" use:navlink>
    My Apps
  </a>

  <Avatar initial={$profile?.name?.[0] || $profile?.email?.[0]} />
{/if}
