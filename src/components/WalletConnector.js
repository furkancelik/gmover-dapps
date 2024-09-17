import { useEthereum } from "@/context/EthereumContext";
import { useContractCalls } from "@/hooks/useContractCalls";
import {
  getGMOVEBalance,
  setEthereumConnection,
} from "@/utils/contractHelpers";
import React, { useEffect, useState } from "react";

const WalletConnector = () => {
  const {
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    userAddress,
    connectedWallet,
    error,
    detectedProviders,
    changeNetwork,
  } = useEthereum();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (signer && provider) {
      setEthereumConnection(signer, provider);
    }
  }, [signer, provider]);

  async function fetchData() {
    // const contractInfo = CONTRACTS[contractName];
    // return new ethers.Contract(contractInfo.address, contractInfo.ABI, _signer);
    // await window.nightly?.ethereum.request({
    //   method: "wallet_switchEthereumChain",
    //   params: [{ chainId: 0x780c }],
    // });

    const newBalance = await getGMOVEBalance(userAddress);
  }

  const handleConnect = (walletType) => {
    connectWallet(walletType);
    setIsDropdownOpen(false);
  };

  if (userAddress) {
    return (
      <div className="wallet-connector">
        <p>
          Connected with {connectedWallet}: {userAddress.slice(0, 6)}...
          {userAddress.slice(-4)}
        </p>
        <button onClick={disconnectWallet}>Disconnect</button>
        <button onClick={fetchData}>call contract</button>
      </div>
    );
  }

  return (
    <div className="wallet-connector">
      <div className="dropdown">
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          Connect Wallet
        </button>
        {isDropdownOpen && (
          <div className="dropdown-content">
            <button onClick={() => handleConnect("metamask")}>
              Connect MetaMask
            </button>
            <button onClick={() => handleConnect("nightly")}>
              Connect Nightly
            </button>
          </div>
        )}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default WalletConnector;
