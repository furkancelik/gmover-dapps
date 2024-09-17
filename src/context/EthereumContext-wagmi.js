"use client";
import {
  useAccount,
  useBalance,
  useDisconnect,
  useConfig,
  useReconnect,
} from "wagmi";

import { createContext, useContext, useEffect, useState } from "react";

import { CONTRACTS } from "@/utils/contractInfo";

import { useConnectModal } from "@rainbow-me/rainbowkit";

const EthereumContext = createContext({});

export function useEthereum() {
  return useContext(EthereumContext);
}

export const EthereumProvider = ({ children }) => {
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  console.log("Eth", address, isConnected);

  const { data: balance } = useBalance({ address });

  const { disconnect } = useDisconnect();
  const { reconnect } = useReconnect();
  const config = useConfig();

  useEffect(() => {
    reconnect();
  }, []);

  return (
    <EthereumContext.Provider
      value={{
        error: null,
        contracts: null,
        config,
        balance: balance,
        provider: null,
        signer: null,
        userAddress: address,
        isConnected,
        disconnectWallet: disconnect,
        connectWallet: openConnectModal,
        changeNetwork: null,
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
};
