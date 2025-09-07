import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Create HTTP link for GraphQL endpoint
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

// Create auth link to include JWT token from localStorage in request headers
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage if it exists (browser only)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Return headers including Authorization if token present
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create Apollo client by concatenating authLink and httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
