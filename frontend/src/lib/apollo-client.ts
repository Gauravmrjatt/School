import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client';

const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
});

const authLink = new ApolloLink((operation, forward) => {
    // Get the authentication token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    // Add the authorization header to the request
    operation.setContext({
        headers: {
            authorization: token ? `Bearer ${token}` : '',
        },
    });

    return forward(operation);
});

const client = new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },
});

export default client;
