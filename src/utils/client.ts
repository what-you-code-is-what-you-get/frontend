import { JsonApiClient, createCache } from '@drupal-api-client/json-api-client'
import Jsona from 'jsona'

export const client = new JsonApiClient(import.meta.env.VITE_API_URL, {
  // the optional cache will cache a request and return the cached data if the request
  // is made again with the same type same data.
  // The cache must implement the `Cache` interface.
  // The `createCache` method provides a default cache that satisfies this interface.
  cache: import.meta.env.MODE === 'development' ? undefined : createCache(),
  // the optional authentication object will be used to authenticate requests.
  // Currently Basic auth is supported.
  authentication: {
    type: 'Basic',
    // It is recommended to store sensitive information in environment variables that
    // are not checked in to the source code.
    credentials: {
      username: import.meta.env.VITE_BASIC_AUTH_NAME,
      password: import.meta.env.VITE_BASIC_AUTH_PASSWORD,
    },
  },
  // the optional serializer will be used to serialize and deserialize data.
  serializer: new Jsona(),
  // when set to true, verbose logging will be output to the console,
  // helpful for debugging errors.
  debug: import.meta.env.MODE === 'development',
})
