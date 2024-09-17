import { useEthereum } from "@/context/EthereumContext";

import { useEffect } from "react";

// This hook listens to a contract event and calls a handler when the event is emitted
const useContractEvent = (eventName, contract, handleEvent) => {
  const { connectedWallet } = useEthereum();
  useEffect(() => {
    // TODO:nightly de bir hata veriyor bunu daha sonra düzelt!!
    if (connectedWallet === "nightly") return;
    // If the contract is not available, exit early
    if (!contract) return;

    // EventListener function will be triggered when the contract event is emitted
    const eventListener = (...args) => {
      handleEvent(...args); // Call the event handler with event arguments
    };

    // Subscribe to the contract event
    contract.on(eventName, eventListener);

    // Cleanup the listener when the component unmounts or dependencies change
    return () => {
      if (contract && eventListener) {
        contract.off(eventName, eventListener);
      }
    };
  }, [contract, eventName, handleEvent, connectedWallet]); // Re-run the effect when dependencies change
};

export default useContractEvent;
