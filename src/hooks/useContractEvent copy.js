import { useEthereum } from "@/context/EthereumContext";
import { useEffect, useContext } from "react";

const useContractEvent = (eventName, contract, handleEvent) => {
  return null;
  useEffect(() => {
    if (!contract) return; // Eğer contract nesnesi yoksa, hook'u çalıştırma

    // EventListener fonksiyonu, olay tetiklendiğinde çağrılacak
    const eventListener = (...args) => {
      handleEvent(...args); // handleEvent, tetiklenen olaya yanıt olarak dışarıdan sağlanan işlevdir
    };

    // Belirtilen olay için dinleyici ekleyin
    contract.on(eventName, eventListener);

    // Component temizlenirken (yani, unmount olurken), olay dinleyicisini kaldırın
    return () => {
      contract.off(eventName, eventListener);
    };
  }, [contract, eventName]); // useEffect'in bağımlılıkları

  // Bu hook, dışa dönük bir değer döndürmüyor; sadece yan etkiler (etkileşimler) için kullanılıyor
};

export default useContractEvent;
