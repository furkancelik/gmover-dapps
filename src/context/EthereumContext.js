"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ethers, formatEther } from "ethers";

import { CONTRACTS } from "@/utils/contractInfo";

const WALLETS = [
  {
    supported: true,
    key: "metamask",
    name: "MetaMask",
    downloadLink: "https://metamask.io/download/",
    icon: "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjMzIiB2aWV3Qm94PSIwIDAgMzUgMzMiIHdpZHRoPSIzNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iLjI1Ij48cGF0aCBkPSJtMzIuOTU4MiAxLTEzLjEzNDEgOS43MTgzIDIuNDQyNC01LjcyNzMxeiIgZmlsbD0iI2UxNzcyNiIgc3Ryb2tlPSIjZTE3NzI2Ii8+PGcgZmlsbD0iI2UyNzYyNSIgc3Ryb2tlPSIjZTI3NjI1Ij48cGF0aCBkPSJtMi42NjI5NiAxIDEzLjAxNzE0IDkuODA5LTIuMzI1NC01LjgxODAyeiIvPjxwYXRoIGQ9Im0yOC4yMjk1IDIzLjUzMzUtMy40OTQ3IDUuMzM4NiA3LjQ4MjkgMi4wNjAzIDIuMTQzNi03LjI4MjN6Ii8+PHBhdGggZD0ibTEuMjcyODEgMjMuNjUwMSAyLjEzMDU1IDcuMjgyMyA3LjQ2OTk0LTIuMDYwMy0zLjQ4MTY2LTUuMzM4NnoiLz48cGF0aCBkPSJtMTAuNDcwNiAxNC41MTQ5LTIuMDc4NiAzLjEzNTggNy40MDUuMzM2OS0uMjQ2OS03Ljk2OXoiLz48cGF0aCBkPSJtMjUuMTUwNSAxNC41MTQ5LTUuMTU3NS00LjU4NzA0LS4xNjg4IDguMDU5NzQgNy40MDQ5LS4zMzY5eiIvPjxwYXRoIGQ9Im0xMC44NzMzIDI4Ljg3MjEgNC40ODE5LTIuMTYzOS0zLjg1ODMtMy4wMDYyeiIvPjxwYXRoIGQ9Im0yMC4yNjU5IDI2LjcwODIgNC40Njg5IDIuMTYzOS0uNjEwNS01LjE3MDF6Ii8+PC9nPjxwYXRoIGQ9Im0yNC43MzQ4IDI4Ljg3MjEtNC40NjktMi4xNjM5LjM2MzggMi45MDI1LS4wMzkgMS4yMzF6IiBmaWxsPSIjZDViZmIyIiBzdHJva2U9IiNkNWJmYjIiLz48cGF0aCBkPSJtMTAuODczMiAyOC44NzIxIDQuMTU3MiAxLjk2OTYtLjAyNi0xLjIzMS4zNTA4LTIuOTAyNXoiIGZpbGw9IiNkNWJmYjIiIHN0cm9rZT0iI2Q1YmZiMiIvPjxwYXRoIGQ9Im0xNS4xMDg0IDIxLjc4NDItMy43MTU1LTEuMDg4NCAyLjYyNDMtMS4yMDUxeiIgZmlsbD0iIzIzMzQ0NyIgc3Ryb2tlPSIjMjMzNDQ3Ii8+PHBhdGggZD0ibTIwLjUxMjYgMjEuNzg0MiAxLjA5MTMtMi4yOTM1IDIuNjM3MiAxLjIwNTF6IiBmaWxsPSIjMjMzNDQ3IiBzdHJva2U9IiMyMzM0NDciLz48cGF0aCBkPSJtMTAuODczMyAyOC44NzIxLjY0OTUtNS4zMzg2LTQuMTMxMTcuMTE2N3oiIGZpbGw9IiNjYzYyMjgiIHN0cm9rZT0iI2NjNjIyOCIvPjxwYXRoIGQ9Im0yNC4wOTgyIDIzLjUzMzUuNjM2NiA1LjMzODYgMy40OTQ2LTUuMjIxOXoiIGZpbGw9IiNjYzYyMjgiIHN0cm9rZT0iI2NjNjIyOCIvPjxwYXRoIGQ9Im0yNy4yMjkxIDE3LjY1MDctNy40MDUuMzM2OS42ODg1IDMuNzk2NiAxLjA5MTMtMi4yOTM1IDIuNjM3MiAxLjIwNTF6IiBmaWxsPSIjY2M2MjI4IiBzdHJva2U9IiNjYzYyMjgiLz48cGF0aCBkPSJtMTEuMzkyOSAyMC42OTU4IDIuNjI0Mi0xLjIwNTEgMS4wOTEzIDIuMjkzNS42ODg1LTMuNzk2Ni03LjQwNDk1LS4zMzY5eiIgZmlsbD0iI2NjNjIyOCIgc3Ryb2tlPSIjY2M2MjI4Ii8+PHBhdGggZD0ibTguMzkyIDE3LjY1MDcgMy4xMDQ5IDYuMDUxMy0uMTAzOS0zLjAwNjJ6IiBmaWxsPSIjZTI3NTI1IiBzdHJva2U9IiNlMjc1MjUiLz48cGF0aCBkPSJtMjQuMjQxMiAyMC42OTU4LS4xMTY5IDMuMDA2MiAzLjEwNDktNi4wNTEzeiIgZmlsbD0iI2UyNzUyNSIgc3Ryb2tlPSIjZTI3NTI1Ii8+PHBhdGggZD0ibTE1Ljc5NyAxNy45ODc2LS42ODg2IDMuNzk2Ny44NzA0IDQuNDgzMy4xOTQ5LTUuOTA4N3oiIGZpbGw9IiNlMjc1MjUiIHN0cm9rZT0iI2UyNzUyNSIvPjxwYXRoIGQ9Im0xOS44MjQyIDE3Ljk4NzYtLjM2MzggMi4zNTg0LjE4MTkgNS45MjE2Ljg3MDQtNC40ODMzeiIgZmlsbD0iI2UyNzUyNSIgc3Ryb2tlPSIjZTI3NTI1Ii8+PHBhdGggZD0ibTIwLjUxMjcgMjEuNzg0Mi0uODcwNCA0LjQ4MzQuNjIzNi40NDA2IDMuODU4NC0zLjAwNjIuMTE2OS0zLjAwNjJ6IiBmaWxsPSIjZjU4NDFmIiBzdHJva2U9IiNmNTg0MWYiLz48cGF0aCBkPSJtMTEuMzkyOSAyMC42OTU4LjEwNCAzLjAwNjIgMy44NTgzIDMuMDA2Mi42MjM2LS40NDA2LS44NzA0LTQuNDgzNHoiIGZpbGw9IiNmNTg0MWYiIHN0cm9rZT0iI2Y1ODQxZiIvPjxwYXRoIGQ9Im0yMC41OTA2IDMwLjg0MTcuMDM5LTEuMjMxLS4zMzc4LS4yODUxaC00Ljk2MjZsLS4zMjQ4LjI4NTEuMDI2IDEuMjMxLTQuMTU3Mi0xLjk2OTYgMS40NTUxIDEuMTkyMSAyLjk0ODkgMi4wMzQ0aDUuMDUzNmwyLjk2Mi0yLjAzNDQgMS40NDItMS4xOTIxeiIgZmlsbD0iI2MwYWM5ZCIgc3Ryb2tlPSIjYzBhYzlkIi8+PHBhdGggZD0ibTIwLjI2NTkgMjYuNzA4Mi0uNjIzNi0uNDQwNmgtMy42NjM1bC0uNjIzNi40NDA2LS4zNTA4IDIuOTAyNS4zMjQ4LS4yODUxaDQuOTYyNmwuMzM3OC4yODUxeiIgZmlsbD0iIzE2MTYxNiIgc3Ryb2tlPSIjMTYxNjE2Ii8+PHBhdGggZD0ibTMzLjUxNjggMTEuMzUzMiAxLjEwNDMtNS4zNjQ0Ny0xLjY2MjktNC45ODg3My0xMi42OTIzIDkuMzk0NCA0Ljg4NDYgNC4xMjA1IDYuODk4MyAyLjAwODUgMS41Mi0xLjc3NTItLjY2MjYtLjQ3OTUgMS4wNTIzLS45NTg4LS44MDU0LS42MjIgMS4wNTIzLS44MDM0eiIgZmlsbD0iIzc2M2UxYSIgc3Ryb2tlPSIjNzYzZTFhIi8+PHBhdGggZD0ibTEgNS45ODg3MyAxLjExNzI0IDUuMzY0NDctLjcxNDUxLjUzMTMgMS4wNjUyNy44MDM0LS44MDU0NS42MjIgMS4wNTIyOC45NTg4LS42NjI1NS40Nzk1IDEuNTE5OTcgMS43NzUyIDYuODk4MzUtMi4wMDg1IDQuODg0Ni00LjEyMDUtMTIuNjkyMzMtOS4zOTQ0eiIgZmlsbD0iIzc2M2UxYSIgc3Ryb2tlPSIjNzYzZTFhIi8+PHBhdGggZD0ibTMyLjA0ODkgMTYuNTIzNC02Ljg5ODMtMi4wMDg1IDIuMDc4NiAzLjEzNTgtMy4xMDQ5IDYuMDUxMyA0LjEwNTItLjA1MTloNi4xMzE4eiIgZmlsbD0iI2Y1ODQxZiIgc3Ryb2tlPSIjZjU4NDFmIi8+PHBhdGggZD0ibTEwLjQ3MDUgMTQuNTE0OS02Ljg5ODI4IDIuMDA4NS0yLjI5OTQ0IDcuMTI2N2g2LjExODgzbDQuMTA1MTkuMDUxOS0zLjEwNDg3LTYuMDUxM3oiIGZpbGw9IiNmNTg0MWYiIHN0cm9rZT0iI2Y1ODQxZiIvPjxwYXRoIGQ9Im0xOS44MjQxIDE3Ljk4NzYuNDQxNy03LjU5MzIgMi4wMDA3LTUuNDAzNGgtOC45MTE5bDIuMDAwNiA1LjQwMzQuNDQxNyA3LjU5MzIuMTY4OSAyLjM4NDIuMDEzIDUuODk1OGgzLjY2MzVsLjAxMy01Ljg5NTh6IiBmaWxsPSIjZjU4NDFmIiBzdHJva2U9IiNmNTg0MWYiLz48L2c+PC9zdmc+",
  },
  {
    supported: true,
    key: "nightly",
    name: "Nightly",
    downloadLink: "https://nightly.app/download",
    icon: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyOC4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iV2Fyc3R3YV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDg1MS41IDg1MS41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA4NTEuNSA4NTEuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCgkuc3Qwe2ZpbGw6IzYwNjdGOTt9DQoJLnN0MXtmaWxsOiNGN0Y3Rjc7fQ0KPC9zdHlsZT4NCjxnPg0KCTxnIGlkPSJXYXJzdHdhXzJfMDAwMDAwMTQ2MDk2NTQyNTMxODA5NDY0NjAwMDAwMDg2NDc4NTIwMDIxMTY5MTg2ODhfIj4NCgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTEyNCwwaDYwMy42YzY4LjUsMCwxMjQsNTUuNSwxMjQsMTI0djYwMy42YzAsNjguNS01NS41LDEyNC0xMjQsMTI0SDEyNGMtNjguNSwwLTEyNC01NS41LTEyNC0xMjRWMTI0DQoJCQlDMCw1NS41LDU1LjUsMCwxMjQsMHoiLz4NCgk8L2c+DQoJPGcgaWQ9IldhcnN0d2FfMyI+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik02MjMuNSwxNzAuM2MtMzcuNCw1Mi4yLTg0LjIsODguNC0xMzkuNSwxMTIuNmMtMTkuMi01LjMtMzguOS04LTU4LjMtNy44Yy0xOS40LTAuMi0zOS4xLDIuNi01OC4zLDcuOA0KCQkJYy01NS4zLTI0LjMtMTAyLjEtNjAuMy0xMzkuNS0xMTIuNmMtMTEuMywyOC40LTU0LjgsMTI2LjQtMi42LDI2My40YzAsMC0xNi43LDcxLjUsMTQsMTMyLjljMCwwLDQ0LjQtMjAuMSw3OS43LDguMg0KCQkJYzM2LjksMjkuOSwyNS4xLDU4LjcsNTEuMSw4My41YzIyLjQsMjIuOSw1NS43LDIyLjksNTUuNywyMi45czMzLjMsMCw1NS43LTIyLjhjMjYtMjQuNywxNC4zLTUzLjUsNTEuMS04My41DQoJCQljMzUuMi0yOC4zLDc5LjctOC4yLDc5LjctOC4yYzMwLjYtNjEuNCwxNC0xMzIuOSwxNC0xMzIuOUM2NzguMywyOTYuNyw2MzQuOSwxOTguNyw2MjMuNSwxNzAuM3ogTTI1My4xLDQxNC44DQoJCQljLTI4LjQtNTguMy0zNi4yLTEzOC4zLTE4LjMtMjAxLjVjMjMuNyw2MCw1NS45LDg2LjksOTQuMiwxMTUuM0MzMTIuOCwzNjIuMywyODIuMywzOTQuMSwyNTMuMSw0MTQuOHogTTMzNC44LDUxNy41DQoJCQljLTIyLjQtOS45LTI3LjEtMjkuNC0yNy4xLTI5LjRjMzAuNS0xOS4yLDc1LjQtNC41LDc2LjgsNDAuOUMzNjAuOSw1MTQuNywzNTMsNTI1LjQsMzM0LjgsNTE3LjV6IE00MjUuNyw2NzguNw0KCQkJYy0xNiwwLTI5LTExLjUtMjktMjUuNnMxMy0yNS42LDI5LTI1LjZzMjksMTEuNSwyOSwyNS42QzQ1NC43LDY2Ny4zLDQ0MS43LDY3OC43LDQyNS43LDY3OC43eiBNNTE2LjcsNTE3LjUNCgkJCWMtMTguMiw4LTI2LTIuOC00OS43LDExLjVjMS41LTQ1LjQsNDYuMi02MC4xLDc2LjgtNDAuOUM1NDMuOCw0ODgsNTM5LDUwNy42LDUxNi43LDUxNy41eiBNNTk4LjMsNDE0LjgNCgkJCWMtMjkuMS0yMC43LTU5LjctNTIuNC03Ni04Ni4yYzM4LjMtMjguNCw3MC42LTU1LjQsOTQuMi0xMTUuM0M2MzQuNiwyNzYuNSw2MjYuOCwzNTYuNiw1OTguMyw0MTQuOHoiLz4NCgk8L2c+DQo8L2c+DQo8L3N2Zz4NCg==",
  },
];

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

  const [detectedProviders, setDetectedProviders] = useState([]);

  // useEffect(() => {
  //   connectWallet();
  // }, []);

  useEffect(() => {
    const lastConnectedWallet = localStorage.getItem("lastConnectedWallet");
    if (lastConnectedWallet) {
      connectWallet(lastConnectedWallet);
    }

    const handleAnnouncement = (event) => {
      const { detail } = event;
      setDetectedProviders((prevProviders) => {
        if (!prevProviders.some((p) => p.info.uuid === detail.info.uuid)) {
          return [...prevProviders, detail];
        }
        return prevProviders;
      });
    };

    window.addEventListener("eip6963:announceProvider", handleAnnouncement);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () => {
      window.removeEventListener(
        "eip6963:announceProvider",
        handleAnnouncement
      );
    };
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
          if (typeof window?.nightly?.ethereum !== "undefined") {
            ethereumProvider = window?.nightly?.ethereum;
          } else {
            throw new Error("Nightly wallet is not installed!");
          }
          break;
        default:
          throw new Error("Unsupported wallet type");
      }

      // await changeNetwork(ethereumProvider);

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

  // const connectWallet = async () => {
  //   try {
  //     await changeNetwork();
  //     console.log("Wallet connected successfully");
  //   } catch (error) {
  //     console.error("Error connecting wallet:", error.message);
  //     if (error.message.includes("Failed to add the network")) {
  //       setError("To add the network manually in MetaMask");
  //       provideManualAddInstructions(process.env.networkParams);
  //     }
  //   }
  // };

  // const disconnectWallet = () => {
  //   setProvider(null);
  //   setSigner(null);
  //   setUserAddress("");
  //   setContracts(null);
  // };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setUserAddress("");
    setContracts(null);
    setBalance(null);
    setConnectedWallet(null);
    localStorage.removeItem("lastConnectedWallet");
    window.location = "/";
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
      console.log("switchError:", switchError);
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

  const openModalConnectWallet = (openModalWithContent, setIsModalOpen) => {
    openModalWithContent(
      "Connect Wallet",
      <>
        <div className="mt-5 w-full ">
          <div className="flex flex-col items-center gap-3   ">
            {WALLETS.map((wallet, i) => {
              const isSetup = detectedProviders.some(
                ({ info }) => info.name === wallet.name
              );
              return (
                <div key={i} className="flex items-center justify-center">
                  <img
                    src="/connect-wallet-button.png"
                    style={{ maxHeight: 60 }}
                  />
                  <div
                    onClick={() => {
                      if (isSetup) {
                        if (wallet.supported) {
                          connectWallet(wallet.key);
                          setIsModalOpen(false);
                        } else {
                          alert(
                            "Not yet supported. It will be supported as soon as possible."
                          );
                        }
                      } else {
                        if (
                          confirm(
                            `${wallet.name} wallet is not installed. Would you like to download it?`
                          )
                        ) {
                          window.open(wallet.downloadLink, "_blank");
                        }
                      }
                    }}
                    className="absolute mx-auto text-center flex "
                  >
                    <img
                      src={wallet.icon}
                      width={34}
                      height={34}
                      className="mr-2 flex-1"
                    />{" "}
                    <p className="text-2xl">{wallet.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );

    // openModalWithContent(
    //   "Connect Wallet",

    //   <div className="mx-auto flex flex-col items-center">
    //     <div className="py-4">
    //       <div className="flex flex-col items-center ">
    //         {WALLETS.map((wallet, index) => {
    //           const isSetup = detectedProviders.some(
    //             ({ info }) => info.name === wallet.name
    //           );
    //           return (
    //             <div
    //               key={index}
    //               style={{ border: "2px solid red" }}
    //               className="bg-red-800 flex items-center w-full my-4"
    //             >
    //               <img src={wallet.icon} width={38} height={38} />
    //               <p>{wallet.name}</p>
    //             </div>
    //           );
    //         })}

    //         {/* {detectedProviders.map((provider) => (
    //           <button
    //             key={provider.info.uuid}
    //             onClick={() => connectWallet(provider)}
    //           >
    //             Connect to {provider.info.name}
    //           </button>
    //         ))} */}
    //       </div>
    //     </div>

    //     <button
    //       onClick={() => {
    //         setIsModalOpen(false);
    //       }}
    //       className="flex  items-center justify-center px-7 py-2 bg-gradient-to-t from-red-700 to-red-400 hover:from-red-500 hover:to-red-800  border-b-[5px] border-red-900 rounded-2xl text-lg shadow shadow-black/60 text-white "
    //     >
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         fill="none"
    //         viewBox="0 0 24 24"
    //         strokeWidth={2}
    //         stroke="currentColor"
    //         className="w-6 h-6 mr-1"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
    //         />
    //       </svg>
    //       Disconnect Connection
    //     </button>
    //   </div>
    // );
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
        connectWallet: openModalConnectWallet,
        changeNetwork,
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
};
