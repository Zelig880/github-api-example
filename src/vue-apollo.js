import Vue from 'vue'
import VueApollo from 'vue-apollo'
import schema from '../schema.json'
import { IntrospectionFragmentMatcher, InMemoryCache } from 'apollo-cache-inmemory'
import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client'

// Install the vue plugin
Vue.use(VueApollo)

// Name of the localStorage item
const AUTH_TOKEN = 'apollo-token'
const TOKEN = 'Place_Personal_Token_here'

// Http endpoint
const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP || 'https://api.github.com/graphql'
// Files URL root
export const filesRoot = process.env.VUE_APP_FILES_ROOT || httpEndpoint.substr(0, httpEndpoint.indexOf('/graphql'))

Vue.prototype.$filesRoot = filesRoot

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: schema
})

// Config
const defaultOptions = {
  // You can use `https` for secure connection (recommended in production)
  httpEndpoint,
  // You can use `wss` for secure connection (recommended in production)
  // Use `null` to disable subscriptions
  wsEndpoint: process.env.VUE_APP_GRAPHQL_WS,
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false,

  // Override default apollo link
  // note: don't override httpLink here, specify httpLink options in the
  // httpLinkOptions property of defaultOptions.
  // link: myLink

  // Override default cache
  cache: new InMemoryCache({ fragmentMatcher }),

  // Override the way the Authorization header is set
  getAuth: (tokenName) => {
    if (typeof window !== 'undefined') {
      // get the authentication token from local storage if it exists
      var token = window.localStorage.getItem(tokenName) // return the headers to the context so httpLink can read them

      return token ? 'token '.concat(token) : ''
    }
  }
}

// Call this in the Vue app file
export function createProvider (options = {}) {
  setLocalStorageToken()
  // Create apollo client
  const { apolloClient, wsClient } = createApolloClient({
    ...defaultOptions,
    ...options
  })
  apolloClient.wsClient = wsClient

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        // fetchPolicy: 'cache-and-network',
      }
    },
    errorHandler (error) {
      // eslint-disable-next-line no-console
      console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
    }
  })

  return apolloProvider
}

function setLocalStorageToken () {
  if (typeof localStorage !== 'undefined' && TOKEN) {
    localStorage.setItem(AUTH_TOKEN, TOKEN)
  }
}
