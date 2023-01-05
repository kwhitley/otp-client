<script>
  import { pageTitle } from '~/utils/pageTitle'
  import { fetcher } from 'itty-fetcher'

  let history = ''
  let websocket

  const log = (value) => history = history + `${value}\n`

  const connect = async () => {
    log('connecting...')

    fetcher().get('http://localhost:8787/version').then(v => log(`version detected: ${v.version}`))

    console.log('is socket?', websocket instanceof WebSocket)
    if (websocket instanceof WebSocket) {
      log('connection already established')
    } else {
      websocket = new WebSocket('ws://localhost:8787/app/otpg/connect')

      websocket.addEventListener('connected', event => {
        log('connection established!')
        console.log(event.data)
      })

      websocket.addEventListener('message', event => {
        console.log('Message received from server');
        log(event.data)
      })
    }
  }

  const login = async () => {
    log('logging in...')

    console.log('is socket?', websocket instanceof WebSocket)
    if (websocket instanceof WebSocket) {
      log('connection already established')
    } else {
      websocket = new WebSocket('ws://localhost:8787/app/test/connect')

      websocket.addEventListener('connected', event => {
        console.log('Connection established!')
        console.log(event.data)
      })

      websocket.addEventListener('message', event => {
        console.log('Message received from server');
        log(event.data)
      })
    }
  }
</script>

<!-- HEAD -->
<svelte:head>
  <title>{pageTitle('dead-simple auth')}</title>
  <meta name="description" content="Testing zone for OTP garden." />
</svelte:head>

<!-- MARKUP -->
<h2>Socket Test</h2>

<button on:click={connect}>Connect</button>

<pre>
{history}
</pre>

<!-- STYLES -->
<style lang="scss">
  pre {
    padding: 1em;
  }
</style>
