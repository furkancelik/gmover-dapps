import { FaLock } from "react-icons/fa6";
import { useEthereum } from "@/context/EthereumContext";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import InventoryItem from "./Page/InventoryItem";
import useContractEvent from "@/hooks/useContractEvent";

const Inventory = ({
  //   inventory,
  //   openModalWithContent,
  //   // handlePurchase,
  //   setIsModalOpen,
  getInventory,
  title = null,
  inventory,
  setInventory,
  setLoading,
  selectedItem,
  onClick,
}) => {
  const { userAddress, provider, signer, contracts } = useEthereum();
  //   const [inventory, setInventory] = useState([]);

  useContractEvent("TreeStaked", contracts?.treeStakingContract, (user) => {
    if (user.toLowerCase() === userAddress.toLowerCase()) {
      setLoading(false);
      getInventory();
    }
  });

  useContractEvent("TreeUnstaked", contracts?.treeStakingContract, (user) => {
    if (user.toLowerCase() === userAddress.toLowerCase()) {
      setLoading(false);
      getInventory();
    }
  });
  useContractEvent(
    "TractorStaked",
    contracts?.tractorStakingContract,
    (user) => {
      if (user.toLowerCase() === userAddress.toLowerCase()) {
        setLoading(false);
        getInventory();
      }
    }
  );

  useContractEvent(
    "TractorUnstaked",
    contracts?.tractorStakingContract,
    (user) => {
      if (user.toLowerCase() === userAddress.toLowerCase()) {
        setLoading(false);
        getInventory();
      }
    }
  );

  useContractEvent(
    "TractorPurchased",
    contracts?.tractorNftContract,
    (user, amount, totalPrice) => {
      if (user.toLowerCase() === userAddress.toLowerCase()) {
        setLoading(false);
        getInventory();
      }
    }
  );

  useContractEvent("TreePurchased", contracts?.treeNftContract, (user) => {
    if (user.toLowerCase() === userAddress.toLowerCase()) {
      setLoading(false);
      getInventory();
    }
  });

  // TODO: aynsı traktör için de yap

  // const getInventory = async () => {
  //   if (
  //     !signer ||
  //     !contracts?.treeNftContract ||
  //     !contracts?.tractorNftContract
  //   ) {
  //     console.error("Signer or contracts are not available.");
  //     return;
  //   }
  //   const treeNftWithSigner = contracts?.treeNftContract.connect(signer);
  //   const tractorNftWithSigner = contracts?.tractorNftContract.connect(signer);

  //   try {
  //     const treeBalance = await treeNftWithSigner.balanceOf(userAddress, 0);
  //     const tractorBalance = await tractorNftWithSigner.balanceOf(
  //       userAddress,
  //       1
  //     );

  //     const inventoryItems = [];

  //     if (treeBalance > 0) {
  //       inventoryItems.push({
  //         title: "tree",
  //         image: "/agac.png",
  //         quantity: treeBalance.toString(),
  //       });
  //     }

  //     if (tractorBalance > 0) {
  //       inventoryItems.push({
  //         title: "tractor",
  //         image: "/tractor.png",
  //         quantity: tractorBalance.toString(),
  //       });
  //     }

  //     setInventory(inventoryItems);
  //   } catch (error) {
  //     console.error("Error fetching inventory:", error);
  //   }
  // };

  // useEffect(() => {
  //   getInventory(); // Kullanıcı girdiğinde envanteri yükle
  // }, [signer, contracts, userAddress]);

  return (
    <>
      <h2 className="text-xl font-bold mt-2 mb-2 text-black">
        {title || "Items You’ve Purchased"}
      </h2>
      <div className="grid  gap-3 grid-cols-4 mx-2  ">
        {inventory.length > 0 ? (
          inventory.map((item, index) => (
            <InventoryItem
              key={index}
              item={item}
              selectedItem={selectedItem}
              onClick={onClick}
            />
          ))
        ) : (
          <p>No items purchased yet.</p>
        )}
      </div>
    </>
  );
};

export default Inventory;
