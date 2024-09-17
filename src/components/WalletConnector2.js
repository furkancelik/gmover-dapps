import { useEthereum } from "@/context/EthereumContext";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useConnectModal,
  useAccountModal,
  useChainModal,
} from "@rainbow-me/rainbowkit";
import {
  useGMOVEBalance,
  useInventory,
  useClaimLand,
} from "@/utils/contractHelpers";
import { formatEther } from "viem";
import { useEffect } from "react";

export default function WalletConnector2() {
  const { disconnectWallet, userAddress, isConnected, connectWallet } =
    useEthereum();

  console.log("WalletConnector2", userAddress, isConnected);

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();

  const { data: balance, isLoading: balanceLoading } =
    useGMOVEBalance(userAddress);

  useEffect(() => {
    if (balance) {
      console.log("BALANCExx:", formatEther(balance.value));
    }
  }, [balance]);

  return (
    <div>
      <ConnectButton />
      <div>
        {isConnected ? (
          <>
            {userAddress}
            <button onClick={disconnectWallet}>disconnect</button>
          </>
        ) : (
          connectWallet && (
            <button onClick={connectWallet} type="button">
              Open Connect Modal
            </button>
          )
        )}
      </div>
      {/* <ConnectButton.Custom></ConnectButton.Custom> */}
      {openAccountModal && (
        <button onClick={openAccountModal} type="button">
          Open Account Modal
        </button>
      )}
      {openChainModal && (
        <button onClick={openChainModal} type="button">
          Open Chain Modal
        </button>
      )}
    </div>
  );
}
