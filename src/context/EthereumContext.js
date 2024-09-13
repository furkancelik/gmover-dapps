"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ethers, formatEther } from "ethers";

import { CONTRACTS } from "@/utils/contractInfo";

const EthereumContext = createContext({});

export function useEthereum() {
  return useContext(EthereumContext);
}

export const EthereumProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [contracts, setContracts] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      await changeNetwork();
      console.log("Wallet connected successfully");
    } catch (error) {
      console.error("Error connecting wallet:", error.message);
      if (error.message.includes("Failed to add the network")) {
        setError("To add the network manually in MetaMask");
        provideManualAddInstructions(process.env.networkParams);
      }
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setUserAddress("");
    setContracts(null);
  };

  const changeNetwork = async (networkParams = process.env.networkParams) => {
    console.log("nightly:::", window.nightly);

    if (!window.ethereum) {
      console.error("MetaMask is not installed!");
      return;
    }

    try {
      // Önce ağı değiştirmeyi deneyelim
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networkParams.chainId }],
      });
      console.log("Successfully switched to the network");
    } catch (switchError) {
      // Ağ bulunamadıysa, eklemeyi deneyelim
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [networkParams],
          });
          console.log("Network added successfully");

          // Ağ eklendikten sonra tekrar değiştirmeyi deneyelim
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: networkParams.chainId }],
          });
          console.log("Successfully switched to the newly added network");
        } catch (addError) {
          console.error("Detailed error when adding network:", addError);
          alert(
            `Failed to add the network. Please add it manually in MetaMask with these details:\n\nNetwork Name: ${networkParams.chainName}\nRPC URL: ${networkParams.rpcUrls[0]}\nChain ID: 30732 \nCurrency Symbol: ${networkParams.nativeCurrency.symbol}`
          );
          throw new Error(
            "Failed to add the network. Please try adding it manually in MetaMask."
          );
        }
      } else if (switchError.code === 4001) {
        console.log("User rejected the network switch");
        throw new Error("Network switch was rejected. Please try again.");
      } else {
        console.error("Unexpected error when switching network:", switchError);
        throw new Error(
          "An unexpected error occurred. Please try again or contact support."
        );
      }
    }

    // Ağ değiştirildikten sonra provider'ı güncelle
    const ethereumProvider = new ethers.BrowserProvider(window.ethereum);
    setProvider(ethereumProvider);

    // Signer'ı güncelle
    const ethereumSigner = await ethereumProvider.getSigner();
    setSigner(ethereumSigner);

    // Kullanıcı adresini güncelle
    setUserAddress(await ethereumSigner.getAddress());

    // Kontratları yeniden yükle
    loadContracts(ethereumSigner);

    // Bakiyeyi güncelle
    updateBalance(ethereumProvider, ethereumSigner);
  };

  const loadContracts = (signer) => {
    const loadedContracts = {};
    for (const key in CONTRACTS) {
      if (CONTRACTS[key].address && CONTRACTS[key].ABI) {
        loadedContracts[key] = new ethers.Contract(
          CONTRACTS[key].address,
          CONTRACTS[key].ABI,
          signer
        );
      } else {
        console.error(`Missing address or ABI for contract: ${key}`);
      }
    }
    setContracts(loadedContracts);
  };

  const updateBalance = async (provider, signer) => {
    const balance = await provider.getBalance(await signer.getAddress());
    setBalance(formatEther(balance));
  };

  const provideManualAddInstructions = (networkParams) => {
    alert(`To add the network manually in MetaMask, follow these steps:
1. Open MetaMask
2. Click on the network dropdown at the top
3. Click "Add Network"
4. Fill in the following details:
   - Network Name: ${networkParams.chainName}
   - New RPC URL: ${networkParams.rpcUrls[0]}
   - Chain ID: 30732
   - Currency Symbol: ${networkParams.nativeCurrency.symbol}
   - Block Explorer URL: ${networkParams.blockExplorerUrls[0]}
5. Click "Save"
`);
  };

  return (
    <EthereumContext.Provider
      value={{
        error,
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
