<script>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { fly } from 'svelte/transition'
  import Tabs from '~/components/Tabs.svelte'
  import { otp } from '~/services/api'
  import { toast } from '~/services/toast'
  import { editable } from '~/utils/editable'
  import General from './General.svelte'
  import Sessions from './Sessions.svelte'
  import Users from './Users.svelte'

  export let app
  export let appID

  $: editorPage = new URL($page.url)?.search.replace(/^\?/, '')
  $: if (editorPage === '') goto('?general')

  const { changes, dirty, revert, local: config } = editable(app, { trim: true })

  const onSubmit = (e) => {
    e.preventDefault()

    otp
      .updateApp(appID, $changes)
      .catch(err => toast(err.message, { type: 'error', duration: '2 seconds' }))
  }
</script>

<!-- MARKUP -->
<form on:submit={onSubmit}>
  <section class="actions">
    <button type="submit" disabled={!$dirty}>Save Changes</button>
    {#if $dirty}
      <button
        class="secondary"
        in:fly={{ x: 50, duration: 200 }}
        out:fly|local={{ x: -200, duration: 200 }}
        on:click={revert}
        >
        Cancel
      </button>
    {/if}
  </section>

  <Tabs items={[
    { label: 'General', path: '?general' },
    { label: 'Users', path: '?users' },
    { label: 'Tokens & Sessions', path: '?sessions' },
    ]} />


  {#if editorPage === 'general' }
    <General config={config} />
  {/if}

  {#if editorPage === 'users'}
    <Users config={config} />
  {/if}

  {#if editorPage === 'sessions'}
    <Sessions config={config} />
  {/if}
</form>

<!-- <pre>
  {JSON.stringify($changes, null, 2)}
</pre> -->

<!-- STYLES -->
<style lang="scss">
  h3 {
    margin-bottom: 1rem;
  }

  form {
    display: flex;
    flex-flow: column;
  }

  form .actions {
    margin-top: 0;
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
</style>
