"use client";
import "../../styles/globals.css";
import ApolloProvider from "@/context/ApolloProvider";
import { EthereumProvider } from "@/context/EthereumContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { SessionProvider } from "next-auth/react";

export default function Layout({ children }) {
  return (
    <SessionProvider>
      <ApolloProvider>
        <EthereumProvider>
          {children}
          <ToastContainer position="top-center" />
        </EthereumProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}
