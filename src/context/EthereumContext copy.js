"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ethers, formatEther } from "ethers";

import { CONTRACTS } from "@/utils/contractInfo";

const EthereumContext = createContext({});

export function useEthereum() {
  return useContext(EthereumContext);
}

export const EthereumProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [contracts, setContracts] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    changeNetwork();
    // getCurrentNetwork();
    const ethereumProvider = new ethers.BrowserProvider(window.ethereum);
    setProvider(ethereumProvider);

    const ethereumSigner = await ethereumProvider.getSigner();
    setSigner(ethereumSigner);

    setUserAddress(await ethereumSigner.getAddress());

    const loadedContracts = {};

    for (const key in CONTRACTS) {
      if (CONTRACTS[key].address && CONTRACTS[key].ABI) {
        loadedContracts[key] = new ethers.Contract(
          CONTRACTS[key].address,
          CONTRACTS[key].ABI,
          ethereumSigner
        );
      } else {
        console.error(`Missing address or ABI for contract: ${key}`);
      }
    }

    setContracts(loadedContracts);

    setBalance(
      formatEther(
        await ethereumProvider.getBalance(await ethereumSigner.getAddress())
      )
    );
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setUserAddress("");
    setContracts(null);
  };

  const changeNetwork = async (networkParams = process.env.networkParams) => {
    try {
      // MetaMask'ta ağ değiştirmeyi dene
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networkParams.chainId }],
      });
    } catch (switchError) {
      // Bu hata kodu, ağın MetaMask'te tanımlı olmadığını gösterir
      if (switchError.code === 4902) {
        try {
          // Ağ MetaMask'te yoksa, kullanıcıdan yeni ağı eklemesini iste
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [networkParams],
          });
        } catch (addError) {
          // Kullanıcı yeni ağı eklemeyi reddederse veya başka bir hata olursa
          console.error("Could not add the network:", addError);
        }
      } else {
        // Diğer hatalar
        console.error("Could not switch to the network:", switchError);
      }
    }
  };

  return (
    <EthereumContext.Provider
      value={{
        contracts,
        balance,
        provider,
        signer,
        userAddress,
        disconnectWallet,
        connectWallet,
        changeNetwork,
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
};
