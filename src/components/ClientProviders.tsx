"use client";

import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client/react";
import client from "../../lib/apolloClient";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
    </ApolloProvider>
  );
}
