import {
  ApolloClient,
  InMemoryCache,
  from,
  NormalizedCacheObject,
  ApolloLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { useMemo } from 'react';
import { setContext } from '@apollo/client/link/context';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

let session: Session | null = null;

void (async () => {
  try {
    session = await getSession();
  } catch (error) {
    console.error('Error fetching session:', error);
  }
})();

const errorLink: ApolloLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${
          locations
            ? locations
                .map((loc) => `Line: ${loc.line}, Column: ${loc.column}`)
                .join('; ')
            : 'N/A'
        }, Path: ${path ? path.join(' -> ') : 'N/A'}`,
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError.message}`);
  }
});

const uploadLink: ApolloLink = createUploadLink({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:8080/graphql',
  credentials: 'same-origin',
});

const authLink: ApolloLink = setContext(
  (_, { headers }: { headers?: Record<string, string> }) => {
    const token = session?.token?.accessToken;
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  },
);

function createApolloClient(): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // Disables force-fetching on the server
    link: from([authLink, errorLink, uploadLink]),
    cache: new InMemoryCache({
      addTypename: false, // Disable __typename to prevent automatic addition in queries
    }),
  });
}

export function initializeApollo(
  initialState: NormalizedCacheObject | null = null,
): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If initial state is provided, restore the cache with the initial state
  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // On the server, always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;

  // On the client, reuse the same Apollo Client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(
  initialState?: NormalizedCacheObject,
): ApolloClient<NormalizedCacheObject> {
  return useMemo(() => initializeApollo(initialState), [initialState]);
}
