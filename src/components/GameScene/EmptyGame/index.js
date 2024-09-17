"use client";
import { Stage, Container } from "@pixi/react";
import { useEffect, useRef, useState } from "react";
import {
  setEthereumConnection,
  getNFTDetails,
  unstakeItem,
  claimRewardForItem,
} from "@/utils/contractHelpers";
import GridTile from "@/components/GameScene/Grid/GridTile";
import Tractor from "@/components/GameScene/Objects/Tractor";
import Tree from "@/components/GameScene/Objects/Tree";
import Windmill from "@/components/GameScene/Objects/Windmill";
import Wood from "@/components/GameScene/Objects/Wood";
import House from "@/components/GameScene/Objects/House";
import FenceLeft from "@/components/GameScene/Objects/Fence/FenceLeft";
import FenceRight from "@/components/GameScene/Objects/Fence/FenceRight";

import Sun from "@/components/GameScene/Objects/Sun";
import {
  FENCE_LEFT_POSITIONS,
  FENCE_RIGHT_POSITIONS,
  GRID_SIZE,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "@/constants/grid";
import { useSpring, animated } from "react-spring";
import Moon from "../Objects/Moon";
import { useEthereum } from "@/context/EthereumContext";
import { ethers } from "ethers";
import Inventory from "@/components/Inventory";
import { toast, ToastContainer } from "react-toastify";
import { ImSpinner8 } from "react-icons/im";

const AnimatedContainer = animated(Container);
const AnimatedStage = animated(Stage);

function RenderModal({
  updateGmoveBalance,
  setIsModalOpen,
  row,
  col,
  itemType,
}) {
  const { userAddress, signer, contracts, provider } = useEthereum();
  const [loading, setLoading] = useState(true);
  const [stakedNFTDetails, setStakedNFTDetails] = useState(null);

  useEffect(() => {
    if (signer && provider) {
      setEthereumConnection(signer, provider);
      fetchNFTDetails(itemType);
    }
  }, [row, col, itemType, signer, provider]);

  async function getTractorNFTDetails(row, col) {
    if (!signer || !contracts?.tractorStakingContract) {
      console.error("Signer or contract not available");
      return;
    }
    setLoading(true);

    try {
      const tractorStakingWithSigner =
        contracts.tractorStakingContract.connect(signer);
      const details = await tractorStakingWithSigner.getUpdatedStakeInfo(
        userAddress,
        row,
        col
      );

      setStakedNFTDetails({
        stakedAt: new Date(parseInt(details?.stakedAt) * 1000),
        pendingReward: ethers.formatEther(details?.pendingReward),
        stakedDuration: parseInt(details.stakedDuration),
      });
    } catch (error) {
      console.error(
        `Error fetching NFT details for position (${row}, ${col}):`,
        error
      );
    }
    setLoading(false);
  }
  async function getTreeNFTDetails(row, col) {
    if (!signer || !contracts?.treeStakingContract) {
      console.error("Signer or contract not available");
      return;
    }
    setLoading(true);

    try {
      const treeStakingWithSigner =
        contracts.treeStakingContract.connect(signer);
      const details = await treeStakingWithSigner.getUpdatedStakeInfo(
        userAddress,
        row,
        col
      );

      setStakedNFTDetails({
        stakedAt: new Date(parseInt(details?.stakedAt) * 1000),
        pendingReward: ethers.formatEther(details?.pendingReward),
        stakedDuration: parseInt(details.stakedDuration),
      });
    } catch (error) {
      console.error(
        `Error fetching NFT details for position (${row}, ${col}):`,
        error
      );
    }
    setLoading(false);
  }

  async function fetchNFTDetails() {
    setLoading(true);
    try {
      const details = await getNFTDetails(itemType, row, col);
      setStakedNFTDetails(details);
    } catch (error) {
      console.error(
        `Error fetching NFT details for position (${row}, ${col}):`,
        error
      );
    }
    setLoading(false);
  }

  const calculateTimeRemaining = (stakedAt) => {
    if (!stakedAt) return null;
    const now = new Date();
    const stakingPeriod = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const endTime = new Date(stakedAt?.getTime() + stakingPeriod);
    const timeRemaining = endTime - now;

    if (timeRemaining <= 0) {
      return "Unstake available";
    }

    const days = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor(
      (timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
    );
    const minutes = Math.floor(
      (timeRemaining % (60 * 60 * 1000)) / (60 * 1000)
    );

    return `${days}d ${hours}h ${minutes}m remaining`;
  };

  const handleUnstake = async (row, col, itemType) => {
    setLoading(true);

    const unstakePromise = new Promise(async (resolve, reject) => {
      try {
        const result = await unstakeItem(row, col, itemType);
        updateGmoveBalance();
        resolve(
          `${
            itemType.charAt(0).toUpperCase() + itemType.slice(1)
          } unstaked successfully from (${row}, ${col})`
        );
      } catch (error) {
        console.error(`Error unstaking ${itemType}:`, error);
        reject(error);
      }
    });

    try {
      await toast.promise(
        unstakePromise,
        {
          pending: {
            render() {
              return `Unstaking ${itemType} from (${row}, ${col})...`;
            },
            icon: "🔄",
          },
          success: {
            render({ data }) {
              return `${data}`;
            },
            icon: itemType === "tree" ? "🌳" : "🚜",
          },
          error: {
            render({ data }) {
              // Hata mesajını daha kullanıcı dostu hale getiriyoruz
              let errorMessage = `Failed to unstake ${itemType}`;
              if (data.reason) {
                errorMessage += `: ${data.reason}`;
              } else if (data.message) {
                errorMessage += `: ${data.message}`;
              }
              return errorMessage;
            },
            icon: "❌",
          },
        },
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
      setStakedNFTDetails(null);
      setIsModalOpen(false);
    } catch (error) {
      // Error is already handled by toast, so we don't need to do anything here
    } finally {
      setLoading(false);
    }
  };

  const unstakeTree = async (row, col) => {
    await handleUnstake(row, col, "tree");
  };

  const unstakeTractor = async (row, col) => {
    await handleUnstake(row, col, "tractor");
  };

  const unstake = async ({ item, row, col }) => {
    if (item === "tree") {
      await unstakeTree(row, col);
    } else if (item === "tractor") {
      await unstakeTractor(row, col);
    } else {
      toast.error(`Unknown item type: ${item}. Cannot unstake.`, {
        containerId: "modal-container",
      });
    }
  };

  // const unstakeTree = async (row, col) => {
  //   if (!signer || !contracts?.treeStakingContract) {
  //     console.error("Signer or contract not available");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const treeStakingWithSigner =
  //       contracts.treeStakingContract.connect(signer);
  //     const tx = await treeStakingWithSigner.unstake(row, col, {
  //       gasLimit: 300000,
  //     });
  //     await tx.wait();
  //     console.log("NFT unstaked successfully");
  //     setStakedNFTDetails(null);
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     console.log("error.reason:", error.reason);
  //     alert(error.reason);
  //     console.error("Error unstaking NFT:", error);
  //   }
  //   setLoading(false);
  // };
  // const unstakeTractor = async (row, col) => {
  //   if (!signer || !contracts?.tractorStakingContract) {
  //     console.error("Signer or contract not available");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const tractorStakingWithSigner =
  //       contracts.tractorStakingContract.connect(signer);
  //     const tx = await tractorStakingWithSigner.unstake(row, col, {
  //       gasLimit: 300000,
  //     });
  //     await tx.wait();
  //     console.log("NFT unstaked successfully");
  //     setStakedNFTDetails(null);
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     alert(error.message);
  //     console.error("Error unstaking NFT:", error);
  //   }
  //   setLoading(false);
  // };

  // const unstake = async ({ item, row, col }) => {
  //   if (!signer || !contracts?.treeStakingContract) {
  //     console.error("Signer or contract not available");
  //     return;
  //   }

  //   if (item === "tree") {
  //     unstakeTree(row, col);
  //   } else if (item === "tractor") {
  //     unstakeTractor(row, col);
  //   }
  // };

  // const claimReward = async (row, col) => {
  //   if (!signer || !contracts?.treeStakingContract) {
  //     console.error("Signer or contract not available");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const treeStakingWithSigner =
  //       contracts?.treeStakingContract.connect(signer);
  //     console.log(`await treeStakingWithSigner.claimReward(${row}, ${col})`);
  //     const tx = await treeStakingWithSigner.claimReward(row, col, {
  //       gasLimit: 300000,
  //     });
  //     await tx.wait();
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     console.error("Error claiming reward:", error);
  //   }
  //   setLoading(false);
  // };

  const handleClaimReward = async (row, col, itemType) => {
    setLoading(true);
    const claimRewardPromise = new Promise(async (resolve, reject) => {
      try {
        const result = await claimRewardForItem(row, col, itemType);

        updateGmoveBalance();
        resolve(
          `${
            itemType.charAt(0).toUpperCase() + itemType.slice(1)
          } reward claimed successfully for (${row}, ${col})`
        );
      } catch (error) {
        console.error(`Error claiming ${itemType} reward:`, error);
        reject(error);
      }
    });

    try {
      await toast.promise(
        claimRewardPromise,
        {
          pending: {
            render() {
              return `Claiming ${itemType} reward for (${row}, ${col})...`;
            },
            icon: "🔄",
          },
          success: {
            render({ data }) {
              return `${data}`;
            },
            icon: itemType === "tree" ? "🌳" : "🚜",
          },
          error: {
            render({ data }) {
              // Hata mesajını daha kullanıcı dostu hale getiriyoruz
              let errorMessage = `Failed to claim ${itemType} reward`;
              if (data.message.includes("not staked")) {
                errorMessage = `No ${itemType} staked at this location`;
              } else if (data.message.includes("not ready")) {
                errorMessage = `Reward for ${itemType} not ready yet`;
              }
              return errorMessage;
            },
            icon: "❌",
          },
        },
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
      // setIsModalOpen(false);
      fetchNFTDetails(itemType);
    } catch (error) {
      // Error is already handled by toast, so we don't need to do anything here
    } finally {
      // setLoading(false);
    }
  };

  const claimRewardTree = async (row, col) => {
    await handleClaimReward(row, col, "tree");
  };

  const claimRewardTractor = async (row, col) => {
    await handleClaimReward(row, col, "tractor");
  };

  const claimReward = async (row, col, itemType) => {
    if (itemType === "tractor") {
      await claimRewardTractor(row, col);
    } else if (itemType === "tree") {
      await claimRewardTree(row, col);
    } else {
      toast.error(`Unknown item type: ${itemType}. Cannot claim reward.`);
    }
  };

  if (loading)
    return (
      <div className="w-full flex flex-col  h-full justify-center items-center">
        <p className="  flex mx-auto items-center justify-center my-5  mt-10">
          <ImSpinner8 size={30} className="animate-spin text-4xl" />
        </p>
        <p>Loading nft details.</p>
      </div>
    );
  return (
    <>
      <div className="mx-auto">
        <div
          className={`bg-[#cdaa6d]  p-2 rounded-lg flex items-center justify-center shadow-inner shadow-black/40`}
        >
          <div>
            <img
              src={itemType === "tree" ? "/agac.png" : "tractor.png"}
              alt={itemType}
              className={` w-3/4 py-4 mx-auto`}
            />
          </div>
        </div>
        <div className="text-center flex flex-col items-center justify-center mb-2">
          <h3 className=" font-semibold text-lg mt-2">{itemType}</h3>
          {/* <p className="my-2 text-sm font-semibold">APY: NA</p> */}

          <p>
            <span className="font-semibold">Staked At:</span>{" "}
            {stakedNFTDetails?.stakedAt?.toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Pending Reward:</span>{" "}
            {parseFloat(stakedNFTDetails?.pendingReward)?.toFixed(2)} GMOVE
          </p>

          {/* <p>
          <span className="font-semibold">Staked Duration:</span>
          {Math.floor(stakedNFTDetails?.stakedDuration / (24 * 60 * 60))} days
        </p> */}

          <p>
            <span className="font-semibold">Time Remaining:</span>
            {calculateTimeRemaining(stakedNFTDetails?.stakedAt)}
          </p>

          <div className="flex flex-row gap-2 mt-5">
            <button
              onClick={() => {
                claimReward(row, col, itemType);
                // handleRemoveItem({ itemType, row, col });
              }}
              className="px-7 py-2 bg-gradient-to-t from-green-700 to-green-400 hover:from-green-500 hover:to-green-800  border-b-[5px] border-green-900 rounded-2xl text-lg shadow shadow-black/60 text-white "
            >
              Claim GMOVE
            </button>

            <button
              onClick={() => {
                // handleRemoveItem({ itemType, row, col });
                unstake({ item: itemType, row, col });
              }}
              className="px-7 py-2 bg-gradient-to-t from-red-700 to-red-400 hover:from-red-500 hover:to-red-800  border-b-[5px] border-red-900 rounded-2xl text-lg shadow shadow-black/60 text-white "
            >
              UNSTAKE
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const EmptyGame = ({
  updateGmoveBalance,
  stake,
  // calculateTimeRemaining,
  // stakeLoading,
  // stakedNFTDetails,
  // fetchStakedNFTDetails,
  updateLand,
  gridState,
  kaynak,
  setKaynak,
  openModalWithContent,
  claimResource,
  setIsModalOpen,
  inventory,
  setInventory,
  setSelectedItem,
  selectedItem,
  setShowSideMenu,
  setSelectedContent,
  playGame,
  setPlayGame,
  setGridState,
}) => {
  if (gridState === null) return null;
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 800,
    height: typeof window !== "undefined" ? window.innerHeight : 600,
  });

  const [scaleFactor, setScaleFactor] = useState(1);

  const { opacity } = useSpring({
    from: {
      opacity: 0.4,
    },
    to: {
      opacity: 1,
    },
    config: { tension: 100, friction: 40 },
    pause: !playGame,
  });

  const { background } = useSpring({
    background: playGame
      ? "linear-gradient(to bottom, #a1e2f2 15%, #72bed5 85%)"
      : "linear-gradient(to bottom, #120408 15%, #010001 85%)",
    config: { tension: 100, friction: 40 },
  });

  const { scale } = useSpring({
    scale: playGame ? scaleFactor : 0.5, // Animasyonun başlangıç ve bitiş değerleri
    config: { tension: 100, friction: 20 },
    immediate: !playGame, // playGame false olduğunda animasyonu devre dışı bırak
  });

  useEffect(() => {
    const handleResize = () => {
      const newWindowSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      setWindowSize(newWindowSize);

      const newScaleFactor = Math.min(
        newWindowSize.width / 800,
        newWindowSize.height / 600
      );
      setScaleFactor(newScaleFactor);
    };

    window.addEventListener("resize", handleResize);

    // Initial scale factor and stage position calculation
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleTileClick = (row, col) => {
    if (gridState[row][col] === "dry") {
      if (kaynak > 0) {
        updateLand(row, col, "grass", 1);
      } else {
        // alert("Insufficient resources! You need to collect more resources.");
        openModalWithContent(
          "Arid Land",
          <div className="mx-auto flex flex-col items-center">
            <div
              className={`bg-[#cdaa6d]     p-2 rounded-lg flex items-center  justify-center shadow-inner shadow-black/40`}
            >
              <div>
                <img
                  src={"/a.png"}
                  alt={"Arid Land"}
                  className={` w-3/4 py-4 mx-auto`}
                />
              </div>
            </div>
            <div className="text-center flex flex-col items-center justify-center mb-2">
              <h3 className=" font-semibold text-lg mt-2">Arid Land</h3>
              <p className="my-1 text-sm font-semibold">
                Convert this area to arable land for 1 resource and in this way
                you can plant something in the field and start earning you can
                start.
              </p>

              <button
                onClick={() => {
                  // setKaynak((kaynak) => kaynak + 1);
                  claimResource();
                  setIsModalOpen(false);
                }}
                className="mt-4 px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
              >
                Claim +1 Resource
              </button>
            </div>
          </div>
        );
      }
    } else if (gridState[row][col] === "grass") {
      if (selectedItem) {
        // inventory içindeki seçili itemi bul
        // const itemIndex = inventory.findIndex(
        //   (invItem) => invItem.title === selectedItem.title
        // );

        // if (itemIndex !== -1 && inventory[itemIndex].count > 0) {
        // Onay penceresi
        const confirmPlacement = window.confirm(
          `Are you sure you want to place the ${selectedItem.title} in this area?`
        );

        if (confirmPlacement) {
          const newGridState = [...gridState];
          newGridState[row][col] = selectedItem.title; // Eşleşen itemin başlığını kullan
          setGridState(newGridState);
          // alert(newGridState[row][col]);
          stake({ item: selectedItem, row, col });
          // alert("stake");
          setSelectedItem(null);
        } // else durumunda bir işlem yapmıyoruz, kullanıcı Hayır dediyse hiçbir işlem yapılmıyor
        // } else {
        //   alert("The item you selected is not in your inventory!");
        // }
      } else {
        // alert(
        //   "Please select an item to plant! You can choose an item you’ve purchased from the Available Items."
        // );

        openModalWithContent(
          "Arable Land",
          <div className="mx-auto flex flex-col items-center">
            <div
              className={`bg-[#cdaa6d]     p-2 rounded-lg flex items-center  justify-center shadow-inner shadow-black/40`}
            >
              <div>
                <img
                  src={"/b.png"}
                  alt={"Arable Land"}
                  className={` w-3/4 py-4 mx-auto`}
                />
              </div>
            </div>
            <div className="text-center flex flex-col items-center justify-center mb-2">
              <h3 className=" font-semibold text-lg mt-2">Arable Land</h3>
              <p className="my-1 text-sm font-semibold">
                In this field you can add items that you have already purchased
                and in this way, you can start earning.
              </p>

              {inventory.length > 0 ? (
                <Inventory
                  inventory={inventory}
                  setInventory={setInventory}
                  setLoading={() => {
                    //setLoading
                  }}
                  selectedItem={selectedItem}
                  onClick={(item) => {
                    const confirmPlacement = window.confirm(
                      `Are you sure you want to place the ${item.title} in this area?`
                    );

                    if (confirmPlacement) {
                      const newGridState = [...gridState];
                      newGridState[row][col] = item.title; // Eşleşen itemin başlığını kullan
                      setGridState(newGridState);
                      stake({ item, row, col });

                      setSelectedItem(false);
                      setIsModalOpen(false);
                    }
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <button
                    onClick={() => {
                      setShowSideMenu(true);
                      setIsModalOpen(false);
                      setSelectedContent("market");
                    }}
                    className="px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
                  >
                    Go to Market
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      }
    }
  };

  const handleItemClick = async (itemType, row, col) => {
    // stakeLoading, stakedNFTDetails
    // fetchStakedNFTDetails(row, col);

    openModalWithContent(
      itemType === "tree" ? "Tree" : "Tractor",
      <RenderModal
        updateGmoveBalance={updateGmoveBalance}
        setIsModalOpen={setIsModalOpen}
        itemType={itemType}
        row={row}
        col={col}
      />
    );

    // openModalWithContent(
    //   itemType === "tree" ? "Tree" : "Tractor",
    //   <div className="mx-auto">
    //     <div
    //       className={`bg-[#cdaa6d]  p-2 rounded-lg flex items-center justify-center shadow-inner shadow-black/40`}
    //     >
    //       <div>
    //         <img
    //           src={itemType === "tree" ? "/agac.png" : "tractor.png"}
    //           alt={itemType}
    //           className={` w-3/4 py-4 mx-auto`}
    //         />
    //       </div>
    //     </div>
    //     <div className="text-center flex flex-col items-center justify-center mb-2">
    //       <h3 className=" font-semibold text-lg mt-2">{itemType}</h3>
    //       {/* <p className="my-2 text-sm font-semibold">APY: NA</p> */}

    //       <p>
    //         <span className="font-semibold">Staked At:</span>{" "}
    //         {stakedNFTDetails?.stakedAt?.toLocaleString()}
    //       </p>
    //       <p>
    //         <span className="font-semibold">Pending Reward:</span>{" "}
    //         {stakedNFTDetails.pendingReward} GMOVE
    //       </p>
    //       <p>
    //         <span className="font-semibold">Staked Duration:</span>
    //         {Math.floor(stakedNFTDetails.stakedDuration / (24 * 60 * 60))} days
    //       </p>

    //       {/* <p>
    //         <span className="font-semibold">Time Remaining:</span>
    //         {calculateTimeRemaining(stakedNFTDetails?.stakedAt)}
    //       </p> */}

    //       <button
    //         onClick={() => {
    //           handleRemoveItem({ itemType, row, col });
    //         }}
    //         className="px-7 py-2 bg-gradient-to-t from-red-700 to-red-400 hover:from-red-500 hover:to-red-800  border-b-[5px] border-red-900 rounded-2xl text-lg shadow shadow-black/60 text-white "
    //       >
    //         Burn
    //       </button>
    //     </div>
    //   </div>
    // );
  };

  const renderGrid = () => {
    const zeminIzgara = [];
    const sabitObjeler = [];
    const dinamikObjeler = [];

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const tileType = getTileTexture(row, col);
        const interactive = isTileInteractive(row, col);

        zeminIzgara.push(
          <GridTile
            key={`tile-${row}-${col}`}
            tileType={tileType}
            row={row}
            col={col}
            interactive={interactive}
            onClick={() => handleTileClick(row, col)}
          />
        );

        if (
          FENCE_LEFT_POSITIONS.some(
            ([fenceRow, fenceCol]) => fenceRow === row && fenceCol === col
          )
        ) {
          sabitObjeler.push(
            <FenceLeft key={`fence-left-${row}-${col}`} row={row} col={col} />
          );
        }

        if (
          FENCE_RIGHT_POSITIONS.some(
            ([fenceRow, fenceCol]) => fenceRow === row && fenceCol === col
          )
        ) {
          sabitObjeler.push(
            <FenceRight key={`fence-right-${row}-${col}`} row={row} col={col} />
          );
        }

        if (gridState[row][col] === "tractor") {
          dinamikObjeler.push(
            <Tractor
              key={`tractor-${row}-${col}`}
              row={row}
              col={col}
              onClick={() => handleItemClick(gridState[row][col], row, col)}
            />
          );
        }
        if (gridState[row][col] === "tree") {
          dinamikObjeler.push(
            <Tree
              key={`tree-${row}-${col}`}
              row={row}
              col={col}
              onClick={() => handleItemClick(gridState[row][col], row, col)}
            />
          );
        }
      }
    }

    sabitObjeler.push(
      <House
        key={`house`}
        row={0}
        col={0}
        onClick={() => {
          setSelectedContent("home");
          setShowSideMenu(true);
        }}
      />
    );
    sabitObjeler.push(
      <Windmill
        key={`windmill`}
        row={0}
        col={3}
        onClick={() => {
          setSelectedContent("missions");
          setShowSideMenu(true);
        }}
      />
    );

    sabitObjeler.push(
      <Wood
        key={`wood`}
        row={0}
        col={2}
        onClick={() => {
          // setKaynak(kaynak + 1);
          claimResource();
          setSelectedContent("resource");
          setShowSideMenu(true);
        }}
      />
    );

    return [...zeminIzgara, ...sabitObjeler, ...dinamikObjeler];
  };

  const getTileTexture = (row, col) => {
    const isUnderObject = isTileUnderObject(row, col);
    return isUnderObject
      ? "grass"
      : gridState[row][col] === "dry"
      ? "dry"
      : "grass";
  };

  const isTileInteractive = (row, col) => {
    return !isTileUnderObject(row, col);
  };

  const isTileUnderObject = (row, col) => {
    return (
      (row === 0 && col === 0) ||
      (row === 0 && col === 1) ||
      (row === 1 && col === 0) ||
      (row === 1 && col === 1) ||
      (row === 0 && col === 2) ||
      (row === 0 && col === 3) ||
      gridState[row][col] === "tractor" ||
      gridState[row][col] === "tree"
    );
  };

  return (
    <AnimatedStage
      width={windowSize.width}
      height={windowSize.height}
      // className=" fixed z-0 bg-gradient-to-b to-85% from-[#a1e2f2] to-[#72bed5]"
      style={{ background }} // Animated background style
      options={{
        backgroundAlpha: 0,
        resizeTo: typeof window !== "undefined" ? window : null,
      }}
    >
      <AnimatedContainer
        x={windowSize.width / 2 - (TILE_WIDTH * scaleFactor) / 2}
        y={windowSize.height / 2 - TILE_HEIGHT * 2.2 * scaleFactor - 40}
        scale={scale.to((s) => ({ x: s, y: s }))}
        //   alpha={0.2}
      >
        <Sun
          playGame={playGame}
          scaleFactor={scaleFactor}
          windowSize={windowSize}
        />

        <Moon
          playGame={playGame}
          scaleFactor={scaleFactor}
          windowSize={windowSize}
        />
        <AnimatedContainer
          x={0}
          y={0}
          alpha={opacity} // opacity animasyonu
          // scale={scale.to((s) => ({ x: s, y: s }))}
        >
          {renderGrid()}
        </AnimatedContainer>
      </AnimatedContainer>

      {/* <Container
            x={windowSize.width / 2 - (TILE_WIDTH * scaleFactor) / 2}
            y={windowSize.height / 2 - TILE_HEIGHT * 2.2 * scaleFactor - 40}
            scale={{
              x: scaleFactor,
              y: scaleFactor,
            }}
          >
            <Sun scaleFactor={scaleFactor} windowSize={windowSize} />
            {renderGrid()}
          </Container> */}
    </AnimatedStage>
  );
};

export default EmptyGame;
