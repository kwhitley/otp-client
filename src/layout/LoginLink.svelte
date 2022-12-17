<script>
  import { goto } from '$app/navigation'
  import { session, logout } from '~/services/auth'

  const logoutAndRedirect = (e) => {
    e.preventDefault()
    logout()
    goto('/')
  }
</script>

<!-- MARKUP -->
{#if $session.isLoggedIn}
  <a href="/logout" on:click={logoutAndRedirect} class="logout">
    Log Out
  </a>
{:else}
  <a href="/login">
    Log In / Sign Up
  </a>
{/if}

<!-- STYLES -->
<style lang="scss">
  .logout {
    opacity: 0.4;
  }
</style>
