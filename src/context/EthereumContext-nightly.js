// useEthereum.js
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
  const [connectedWallet, setConnectedWallet] = useState(null);

  useEffect(() => {
    const lastConnectedWallet = localStorage.getItem("lastConnectedWallet");
    if (lastConnectedWallet) {
      connectWallet(lastConnectedWallet);
    }
  }, []);

  const connectWallet = async (walletType) => {
    try {
      let ethereumProvider;

      switch (walletType) {
        case "metamask":
          if (typeof window.ethereum !== "undefined") {
            ethereumProvider = window.ethereum;
          } else {
            throw new Error("MetaMask is not installed!");
          }
          break;
        case "nightly":
          if (typeof window.nightly.ethereum !== "undefined") {
            ethereumProvider = window.nightly.ethereum;
          } else {
            throw new Error("Nightly wallet is not installed!");
          }
          break;
        default:
          throw new Error("Unsupported wallet type");
      }

      await changeNetwork(ethereumProvider);

      const provider = new ethers.BrowserProvider(ethereumProvider);
      setProvider(provider);

      const signer = await provider.getSigner();
      setSigner(signer);

      const address = await signer.getAddress();
      setUserAddress(address);

      loadContracts(signer);
      updateBalance(provider, signer);

      setConnectedWallet(walletType);
      localStorage.setItem("lastConnectedWallet", walletType);

      console.log(`${walletType} wallet connected successfully`);
    } catch (error) {
      console.error(`Error connecting ${walletType} wallet:`, error.message);
      setError(error.message);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setUserAddress("");
    setContracts(null);
    setBalance(null);
    setConnectedWallet(null);
    localStorage.removeItem("lastConnectedWallet");
  };

  const changeNetwork = async (
    ethereumProvider,
    networkParams = process.env.networkParams
  ) => {
    try {
      await ethereumProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networkParams.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await ethereumProvider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams],
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
          provideManualAddInstructions(networkParams);
          throw new Error(
            "Failed to add the network. Please try adding it manually."
          );
        }
      } else {
        throw switchError;
      }
    }
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

  // Yeni safeContract fonksiyonu
  const safeContract = async (contractName, method, params = []) => {
    console.log("contractName, method, params:", contractName, method, params);

    // Nightly Wallet ve MetaMask kontrolü
    if (!contracts?.[contractName] || !signer) {
      console.error(`Contract ${contractName} or signer is not available.`);
      return;
    }

    try {
      let contractWithSigner;

      // Cüzdanın türüne göre signer seçimi
      if (connectedWallet === "nightly") {
        const nightlyProvider = new ethers.BrowserProvider(
          window.nightly.ethereum
        ); // Nightly Wallet Ethereum sağlayıcısını kullan
        const nightlySigner = await nightlyProvider.getSigner();
        contractWithSigner = contracts?.[contractName].connect(nightlySigner);
      } else if (connectedWallet === "metamask") {
        const metamaskProvider = new ethers.BrowserProvider(window.ethereum); // MetaMask sağlayıcısını kullan
        const metamaskSigner = await metamaskProvider.getSigner();
        contractWithSigner = contracts?.[contractName].connect(metamaskSigner);
      } else {
        console.error("Unsupported wallet type.");
        return;
      }

      // Contract methodunu çağırma
      const result = await contractWithSigner[method](...params);

      return result;
    } catch (error) {
      console.log(">>>contractWithSigner", error);
      console.error(`Error interacting with ${contractName}:`, error);
      throw error;
    }
  };

  const provideManualAddInstructions = (networkParams) => {
    alert(`To add the network manually in your wallet, follow these steps:
1. Open your wallet
2. Add a new network
3. Fill in the following details:
   - Network Name: ${networkParams.chainName}
   - New RPC URL: ${networkParams.rpcUrls[0]}
   - Chain ID: ${networkParams.chainId}
   - Currency Symbol: ${networkParams.nativeCurrency.symbol}
   - Block Explorer URL: ${networkParams.blockExplorerUrls[0]}
4. Save the network
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
        connectedWallet,
        connectWallet,
        disconnectWallet,
        changeNetwork,
        safeContract, // safeContract'ı burada sağlıyoruz
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
};
