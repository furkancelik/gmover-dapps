import { FaLock } from "react-icons/fa6";
import InventoryItem from "./InventoryItem";
import { useEthereum } from "@/context/EthereumContext";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Inventory from "../Inventory";
import { toast } from "react-toastify";

const MarketContent = ({
  inventory,
  setInventory,
  openModalWithContent,
  // handlePurchase,
  setIsModalOpen,
  selectedItem,
  setSelectedItem,
  updateGmoveBalance,
}) => {
  const { userAddress, provider, signer, contracts } = useEthereum();

  const [loading, setLoading] = useState(false);

  // TODO: sabit olarak çekebiliriz.
  const items = [
    {
      title: "tree",
      image: "/agac.png",
      price: 50,
      type: "tree",
      isLock: false,
    },
    {
      title: "tractor",
      image: "/tractor.png",
      price: 250,
      type: "tractor",
      isLock: false,
    },
  ];

  // const buyTree = async (item) => {
  //   if (
  //     !signer ||
  //     !contracts?.treeNftContract ||
  //     !contracts?.gmoveTokenContract
  //   ) {
  //     console.error("Signer or contracts are not available.");
  //     return;
  //   }

  //   try {
  //     const treeNftWithSigner = contracts?.treeNftContract.connect(signer);
  //     const gmoveWithSigner = contracts?.gmoveTokenContract.connect(signer);
  //     const totalPrice = ethers.parseUnits(item.price.toString(), 18);
  //     // GMOVE token'ı TreeNFT kontratına transfer etmek için onay veriyoruz
  //     const approveTx = await gmoveWithSigner.approve(
  //       contracts?.treeNftContract.target,
  //       totalPrice
  //     );
  //     await approveTx.wait();
  //     // buyTree fonksiyonunu çağırıyoruz
  //     const buyTx = await treeNftWithSigner.buyTree(1);
  //     await buyTx.wait();
  //   } catch (error) {
  //     console.error("Error purchasing Tree NFT:", error);
  //   }
  // };

  // const buyTractor = async (item) => {
  //   if (
  //     !signer ||
  //     !contracts?.tractorNftContract ||
  //     !contracts?.gmoveTokenContract
  //   ) {
  //     console.error("Signer or contracts are not available.");
  //     return;
  //   }

  //   try {
  //     const tractorNftWithSigner =
  //       contracts?.tractorNftContract.connect(signer);
  //     const gmoveWithSigner = contracts?.gmoveTokenContract.connect(signer);
  //     const totalPrice = ethers.parseUnits(item.price.toString(), 18);
  //     // GMOVE token'ı TractorNFT kontratına transfer etmek için onay veriyoruz
  //     const approveTx = await gmoveWithSigner.approve(
  //       contracts?.tractorNftContract.target,
  //       totalPrice
  //     );
  //     await approveTx.wait();
  //     // buyTractor fonksiyonunu çağırıyoruz
  //     const buyTx = await tractorNftWithSigner.buyTractor(1);
  //     await buyTx.wait();
  //   } catch (error) {
  //     console.error("Error purchasing Tractor NFT:", error);
  //   }
  // };

  const buyTree = async (item) => {
    if (
      !signer ||
      !contracts?.treeNftContract ||
      !contracts?.gmoveTokenContract
    ) {
      toast.error("Signer or contracts are not available.");
      return;
    }

    const buyTreePromise = new Promise(async (resolve, reject) => {
      try {
        const treeNftWithSigner = contracts?.treeNftContract.connect(signer);
        const gmoveWithSigner = contracts?.gmoveTokenContract.connect(signer);
        const totalPrice = ethers.parseUnits(item.price.toString(), 18);

        // GMOVE token'ı TreeNFT kontratına transfer etmek için onay veriyoruz
        const approvePromise = new Promise(
          async (resolveApprove, rejectApprove) => {
            try {
              const approveTx = await gmoveWithSigner.approve(
                contracts?.treeNftContract.target,
                totalPrice
              );
              await approveTx.wait();
              resolveApprove("GMOVE transfer approved!");
            } catch (error) {
              rejectApprove(error);
            }
          }
        );

        // Onay işlemi için toast.promise kullanımı
        await toast.promise(
          approvePromise,
          {
            pending: "Approving GMOVE transfer...",
            success: {
              render({ data }) {
                return `${data}`;
              },
              icon: "✅",
            },
            error: {
              render({ data }) {
                return `Failed to approve GMOVE transfer: ${data.message}`;
              },
            },
          },
          {
            position: "top-center",
          }
        );

        // buyTree fonksiyonunu çağırıyoruz (Promise olarak)
        const purchasePromise = new Promise(
          async (resolvePurchase, rejectPurchase) => {
            try {
              const buyTx = await treeNftWithSigner.buyTree(1);
              await buyTx.wait();
              resolvePurchase("Tree NFT purchased successfully!");
            } catch (error) {
              rejectPurchase(error);
            }
          }
        );

        // Satın alma işlemi için toast.promise kullanımı
        await toast.promise(
          purchasePromise,
          {
            pending: "Purchasing Tree NFT...",
            success: {
              render({ data }) {
                return `${data}`;
              },
              icon: "🌳",
            },
            error: {
              render({ data }) {
                return `Failed to purchase Tree NFT: ${data.message}`;
              },
            },
          },
          {
            position: "top-center",
          }
        );

        resolve("Tree NFT purchase process completed!");
      } catch (error) {
        console.error("Error in Tree NFT purchase process:", error);
        reject(error);
      }
    });

    // Dış Promise için toast.promise kullanımı
    toast.promise(
      buyTreePromise,
      {
        pending: "Processing Tree NFT purchase...",
        success: {
          render({ data }) {
            return `${data}`;
          },
          icon: "✅",
        },
        error: {
          render({ data }) {
            return `Error in Tree NFT purchase process: ${data.message}`;
          },
        },
      },
      {
        position: "top-center",
        autoClose: 5000,
      }
    );

    return buyTreePromise;
  };

  const buyTractor = async (item) => {
    if (
      !signer ||
      !contracts?.tractorNftContract ||
      !contracts?.gmoveTokenContract
    ) {
      toast.error("Signer or contracts are not available.");
      return;
    }

    const buyTractorPromise = new Promise(async (resolve, reject) => {
      try {
        const tractorNftWithSigner =
          contracts?.tractorNftContract.connect(signer);
        const gmoveWithSigner = contracts?.gmoveTokenContract.connect(signer);
        const totalPrice = ethers.parseUnits(item.price.toString(), 18);

        // GMOVE token'ı TractorNFT kontratına transfer etmek için onay veriyoruz
        toast.info("Approving GMOVE transfer...", { autoClose: false });
        const approveTx = await gmoveWithSigner.approve(
          contracts?.tractorNftContract.target,
          totalPrice
        );
        await approveTx.wait();
        toast.dismiss();
        toast.success("GMOVE transfer approved!");

        // buyTractor fonksiyonunu çağırıyoruz (Promise olarak)
        const purchasePromise = new Promise(
          async (resolveNested, rejectNested) => {
            try {
              const buyTx = await tractorNftWithSigner.buyTractor(1);
              await buyTx.wait();
              resolveNested("Tractor NFT purchased successfully!");
            } catch (error) {
              rejectNested(error);
            }
          }
        );

        // İç Promise için toast.promise kullanımı
        await toast.promise(
          purchasePromise,
          {
            pending: "Purchasing Tractor NFT...",
            success: {
              render({ data }) {
                return `${data}`;
              },
              icon: "🚜",
            },
            error: {
              render({ data }) {
                return `Failed to purchase Tractor NFT: ${data.message}`;
              },
            },
          },
          {
            position: "top-center",
          }
        );

        resolve("Tractor NFT purchase process completed!");
      } catch (error) {
        console.error("Error in Tractor NFT purchase process:", error);
        reject(error);
      }
    });

    // Dış Promise için toast.promise kullanımı
    toast.promise(
      buyTractorPromise,
      {
        pending: "Processing Tractor NFT purchase...",
        success: {
          render({ data }) {
            return `${data}`;
          },
          icon: "✅",
        },
        error: {
          render({ data }) {
            return `Error in Tractor NFT purchase process: ${data.message}`;
          },
        },
      },
      {
        position: "top-center",
        autoClose: 5000,
      }
    );

    return buyTractorPromise;
  };

  const handlePurchase = async (item) => {
    if (!signer || !contracts?.gmoveTokenContract) {
      toast.error("Signer or GMOVE contract is not available.");
      return;
    }

    const purchasePromise = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const gmoveWithSigner = contracts?.gmoveTokenContract.connect(signer);
        const balance = await gmoveWithSigner.balanceOf(userAddress);
        const itemCost = ethers.parseUnits(item.price.toString(), 18);
        const balanceBN = BigInt(balance);

        if (balanceBN >= itemCost) {
          if (item.type === "tree") {
            await buyTree(item);
          } else if (item.type === "tractor") {
            await buyTractor(item);
          }
          updateGmoveBalance();
          resolve(`Successfully purchased ${item.type}`);
        } else {
          reject(new Error("Insufficient GMOVE balance"));
        }
      } catch (error) {
        reject(error);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(
      purchasePromise,
      {
        pending: {
          render() {
            return `Purchasing ${item.type}...`;
          },
          icon: "🛒",
        },
        success: {
          render({ data }) {
            return `${data}`;
          },
          icon: "✅",
        },
        error: {
          render({ data }) {
            if (data.message.includes("Insufficient GMOVE balance")) {
              return "Insufficient GMOVE! You cannot purchase this item.";
            }
            return `Failed to purchase ${item.type}: ${data.message}`;
          },
          icon: "❌",
        },
      },
      {
        position: "top-center",
        autoClose: 3000,
      }
    );
  };

  return (
    <div className="mb-4 mx-auto">
      <h2 className="text-xl font-bold mt-2 mb-2 text-black">
        Items You Can Purchase
      </h2>

      <div className="grid  gap-3 grid-cols-4 mx-2  ">
        {loading ? (
          <p>Loading...</p>
        ) : (
          [
            ...items,
            ...Array(12 - items.length).fill({
              title: "none",
              image: "/agac.png",
              isLock: true,
              price: 0,
            }),
          ].map((item, index) => (
            <button
              disabled={item.isLock}
              onClick={() => {
                openModalWithContent(
                  "Tree NFT Buy",
                  <div className="mx-auto">
                    <div
                      className={`bg-[#cdaa6d]  p-2 rounded-lg flex items-center justify-center shadow-inner shadow-black/40`}
                    >
                      <div>
                        <img
                          src={item.image}
                          alt={item.title}
                          className={` w-3/4 py-4 mx-auto`}
                        />
                      </div>
                    </div>
                    <div className="text-center flex flex-col items-center justify-center mb-2">
                      <h3 className=" font-semibold text-lg mt-2">
                        {item.title}
                      </h3>
                      <p className="my-2 text-sm font-semibold">
                        {item.price} GMOVE
                      </p>
                      <button
                        onClick={() => {
                          handlePurchase(item);
                          // buy(item);
                          setIsModalOpen(false);
                        }}
                        className="no-sidemenu-show px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
                      >
                        Buy
                      </button>
                      {/* <button className="relative bg-[url('/button.png')] bg-cover bg-center bg-no-repeat min-w-[160px] h-[60px] flex items-center justify-center text-lg font-semibold text-[#422716] px-4 py-2">
                      Satın Al
                    </button> */}
                    </div>
                  </div>
                );
              }}
              key={index}
              className={`bg-[#cdaa6d]  p-2 rounded-lg flex items-center justify-center shadow-inner shadow-black/40  ${
                item.isLock && "opacity-80"
              } hover:bg-[#8adc53] transition-all duration-300 cursor-pointer`}
            >
              {item.isLock && (
                <FaLock color="#4f3c1c" className="size-8 absolute z-[1] " />
              )}
              <div>
                <img
                  src={item.image}
                  alt={item.title}
                  className={`size-11 ${item.isLock && "opacity-50 grayscale"}`}
                />
              </div>
            </button>
          ))
        )}
      </div>
      <Inventory
        inventory={inventory}
        setInventory={setInventory}
        setLoading={setLoading}
        selectedItem={selectedItem}
        onClick={(item) => {
          setSelectedItem((prevItem) => {
            return item === prevItem ? false : item;
          });
        }}
      />
      {/* <h2 className="text-xl font-bold mt-2 mb-2 text-black">
        Items You’ve Purchased
      </h2>
      <div className="grid  gap-3 grid-cols-4 mx-2  ">
        {inventory?.map((item, index) => (
          <InventoryItem
            key={index}
            item={item}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        ))}
      </div> */}
    </div>
  );
};

export default MarketContent;
