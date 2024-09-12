import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import FirebaseProvider from "./context/FirebaseProvider";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import AppProvider from "./context/AppProvider";

const client = new ApolloClient({
  uri: import.meta.env.VITE_API_PROXY_BASE_URL,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
    <FirebaseProvider>
      <ApolloProvider client={client}>
      <App />
      </ApolloProvider>
    </FirebaseProvider>
    </AppProvider>
  </React.StrictMode>
);
