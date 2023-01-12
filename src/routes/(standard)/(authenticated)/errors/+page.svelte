<script lang="ts">
  import { toast } from '~/services/toast'
  import { fetcher } from '~/services/auth'

  const api = fetcher({ base: 'http://localhost:8787' })

  const toastErrors = ({ status, message }) => {
                        toast(`${status}: ${message}`, { type: 'error', duration: '2 seconds' })
                      }

  const getStatus = (code: number, message?: string) =>
    () => api.get(`/status/${code}/${message || ''}`).catch(toastErrors)
</script>

<!-- MARKUP -->
<h2>Errors</h2>

<button on:click={getStatus(400)}>400 Error</button>
<button on:click={getStatus(401)}>401 Error</button>
<button on:click={getStatus(403)}>403 Error</button>
<button on:click={getStatus(404)}>404 Error</button>
<button on:click={getStatus(418)}>418 Error</button>

<style lang="scss">
  button {
    margin-bottom: 0.4rem;
  }
</style>
