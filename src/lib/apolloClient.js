import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
// import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "/api/graphql",
});

// const authLink = setContext((_, { headers }) => {
//   return {
//     headers: { ...headers },
//   };
// });

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
