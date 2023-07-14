import Vue from 'vue';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import VueApollo from 'vue-apollo';
import { FApolloClient } from './FApolloClient.js';

export const skyhighchainFApolloClient = new FApolloClient({
    apolloProviders: [
        {
            http: 'https://xapi.skyhighblockchain.com/',
            // for subscriptions
            ws: '',
        },
    ],
    defaultProviderIndex: 'random',
});

export const testFApolloClient = new FApolloClient({
    apolloProviders: [{
        http: 'https://xapi.skyhighblockchain.com/'
    }],
    defaultProviderIndex: 'random',
});


export const skyhighchainApolloClient = new ApolloClient({
    link: ApolloLink.from([
        skyhighchainFApolloClient.getNetErrorLink(),
        skyhighchainFApolloClient.getRetryLink(),
        skyhighchainFApolloClient.getErrorLink(),
        skyhighchainFApolloClient.getHttpLink(),
    ]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
});

export const testApolloClient = new ApolloClient({
    link: ApolloLink.from([
        testFApolloClient.getNetErrorLink(),
        testFApolloClient.getRetryLink(),
        testFApolloClient.getErrorLink(),
        testFApolloClient.getHttpLink(),
    ]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
});


Vue.use(VueApollo);

export const apolloProvider = new VueApollo({
    clients: {
        skyhighchain: skyhighchainApolloClient,
        test: testApolloClient,
    },
    defaultClient: testApolloClient,
    defaultOptions: {
        $query: {
            fetchPolicy: 'network-only', // 'cache-and-network', 'network-only', 'cache-first'
        },
    },
});
