// lib/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink, from, createHttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { useMemo } from 'react';
import { store } from '../store/store';
import { setContext } from '@apollo/client/link/context';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

let apolloClient;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:8080/graphql",
  credentials: 'same-origin',
});

const authLink = setContext((_, { headers }) => {
  const token = store.getState().sign.token; 
  return {
    headers: {
      ...headers,
      Authorization: token ? `${token}` : '', 
    },
  };
});


function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',  // Disables force-fetching on the server
    link: from([authLink, errorLink, uploadLink]),
    cache: new InMemoryCache({
      addTypename: false  // Disable __typename to prevent automatic addition in queries
    }),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  if (typeof window === 'undefined') return _apolloClient;

  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  return useMemo(() => initializeApollo(initialState), [initialState]);
}
