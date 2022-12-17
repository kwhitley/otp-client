<script>
  import { onMount } from 'svelte'
  import { navlink } from 'svelte-navlink-action'
  import { session } from '~/services/auth'
  import Avatar from '~/layout/Avatar.svelte'
  import { profile } from '~/stores'
  import { fetcher } from '~/services/auth'
  import { itty } from '~/services/api'

  onMount(() => {
    window.fetcher = fetcher

    itty.getProfile()
      .then(results => { $profile = results })
      .catch(err => console.error(err.message))
  })
</script>

<!-- MARKUP -->
{#if $session.isLoggedIn}
  <a href="/apps" use:navlink>
    Apps
  </a>

  <Avatar initial={$profile?.name?.[0] || $profile?.email?.[0]} />
{/if}
