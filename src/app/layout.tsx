"use client";

import "./globals.css";
import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client/react";
import client from "../../lib/apolloClient";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </body>
    </html>
  );
}
