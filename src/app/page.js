"use client";
import { useEffect, useRef, useState } from "react";

import { useEthereum } from "../context/EthereumContext";
import { ethers } from "ethers";
import useContractEvent from "@/hooks/useContractEvent";
import Modal from "@/components/Modal";

import LeftMenu from "@/components/Layout/LeftMenu";
import RightMenu from "@/components/Layout/RightMenu";
import EmptyGame from "@/components/GameScene/EmptyGame";
import Info from "@/components/Info";

import { CREATE_LAND, GET_LAND } from "@/graphql/queries/land";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GRID_SIZE } from "@/constants/grid";
import { toast } from "react-toastify";

import {
  setEthereumConnection,
  getLandState,
  claimLand,
  getGMOVEBalance,
  getInventory,
  stakeTree,
  stakeTractor,
  updateLand,
  getResourceBalance,
  getLastClaimTime,
  claimResource,
} from "@/utils/contractHelpers";

const Page = () => {
  const {
    userAddress,
    provider,
    signer,
    connectWallet,
    contracts,
    error: ethError,
  } = useEthereum();

  const [lastClaimTime, setLastClaimTime] = useState(null);
  const [claimLoading, setClaimLoading] = useState(false);
  const [landID, setLandID] = useState(null);

  const [loading, setLoading] = useState(true);
  const [stakeLoading, setStakeLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [stakedNFTDetails, setStakedNFTDetails] = useState(null);

  const [createLand, { data, loading: createLandLoading, error }] =
    useMutation(CREATE_LAND);

  useEffect(() => {
    setErrorMessage(ethError);
  }, [ethError]);

  async function onLoadGame() {
    try {
      // Contract'ı signer ile bağlayın

      const landState = await getLandState();

      //TODO:çektiğin veriyi güncelle
      setGridState(landState);
      setLoading(false);
      setPlayGame(true);
      fetchLastClaimTime();
      fetchResourceBalance();

      try {
        const { data } = await createLand({
          variables: {
            input: {
              walletAddress: userAddress,
              gridState: landState,
              resources: kaynak || 0,
            },
          },
        });
        setLandID(data.createLand.id);
      } catch (e) {
        console.error("Error creating land:", e);
      }
    } catch (error) {
      if (error.reason === "You need to claim your land first.") {
        setLoading(false);
      } else {
        setErrorMessage(error.message);
        // alert("beklenmedik bir hata meydana geldi!");
      }
    }
  }

  async function handleClaimLand() {
    const claimLandPromise = new Promise(async (resolve, reject) => {
      try {
        const result = await claimLand();
        resolve(result);
      } catch (error) {
        console.error("Error claiming land:", error);
        reject(error);
      }
    });

    toast.promise(
      claimLandPromise,
      {
        pending: {
          render() {
            return "Claiming land...";
          },
          icon: "🏗️",
        },
        success: {
          render({ data }) {
            return `${data}`;
          },
          icon: "🏞️",
        },
        error: {
          render({ data }) {
            // Hata mesajını daha kullanıcı dostu hale getiriyoruz
            let errorMessage = "Failed to claim land";
            if (data.message.includes("You have already claimed your land")) {
              errorMessage = "You have already claimed your land";
            } else if (data.message.includes("Insufficient GMOVE balance")) {
              errorMessage = "Insufficient GMOVE balance to claim land";
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

    await claimLandPromise;
  }

  async function getBalanceGMOVE() {
    try {
      const balance = await getGMOVEBalance(userAddress);
      setPara(parseFloat(balance).toFixed(2));
    } catch (error) {
      console.error("Error fetching GMOVE balance:", error);
    }
  }

  const fetchInventory = async () => {
    try {
      const inventoryItems = await getInventory(userAddress);
      setInventory(inventoryItems);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    if (signer && provider) {
      setEthereumConnection(signer, provider);
      getBalanceGMOVE();
      onLoadGame();
      fetchInventory();
    }
  }, [userAddress, contracts?.landGameContract, signer, provider]);

  const [showSideMenu, setShowSideMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const [selectedContent, setSelectedContent] = useState("home");

  const [selectedItem, setSelectedItem] = useState(null);
  const [kaynak, setKaynak] = useState(0);
  const [para, setPara] = useState(0); // Para state'i
  const [inventory, setInventory] = useState([]); // Alınan öğeleri izlemek için inventory

  const [gridState, setGridState] = useState(
    Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill("dry"))
  );

  const [playGame, setPlayGame] = useState(false);

  useContractEvent("LandClaimed", contracts?.landGameContract, (user, land) => {
    if (user.toLowerCase() === userAddress.toLowerCase()) {
      onLoadGame();
    }
  });

  useContractEvent(
    "ResourceClaimed",
    contracts?.landGameContract,
    (user, amount) => {
      if (user.toLowerCase() === userAddress.toLowerCase()) {
        setKaynak(parseInt(amount.toString()));
        fetchLastClaimTime();
        setClaimLoading(false);
        fetchLastClaimTime;
      }
    }
  );

  useContractEvent(
    "ResourceSpent",
    contracts?.landGameContract,
    (user, amount) => {
      if (user.toLowerCase() === userAddress.toLowerCase()) {
        setKaynak(parseInt(amount.toString()));
        fetchLastClaimTime();
        setClaimLoading(false);
      }
    }
  );

  useContractEvent(
    "LandUpdated",
    contracts?.landGameContract,
    (user, row, col, newGridState) => {
      if (user.toLowerCase() === userAddress.toLowerCase()) {
        // console.log("!LandUpdated", user, row, col, newGridState);
        // const newGridState = [...gridState];
        // newGridState[row][col] = newLandState.toString();
        // console.log("newGridState:", newGridState);
        setGridState((g) => {
          const grids = [...g];
          grids[row][col] = newGridState;
          return grids;
        });
      }
    }
  );

  useContractEvent(
    "ResourceClaimed",
    contracts?.landGameContract,
    (user, amount) => {
      if (user.toLowerCase() === userAddress.toLowerCase()) {
        setKaynak(parseInt(amount.toString()));
        fetchLastClaimTime();
        setClaimLoading(false);
      }
    }
  );

  // const checkAndApproveForStaking = async (
  //   nftWithSigner,
  //   treeStakingAddress
  // ) => {
  //   const treeNftWithSigner = contracts.treeNftContract.connect(signer);
  //   const isApproved = await nftWithSigner.isApprovedForAll(
  //     userAddress,
  //     treeStakingAddress
  //     // contracts.treeStakingContract.target
  //   );

  //   if (!isApproved) {
  //     const approveTx = await nftWithSigner.setApprovalForAll(
  //       treeStakingAddress,
  //       true
  //     );
  //     await approveTx.wait();
  //     console.log("Approval granted for staking");
  //   }
  // };

  // const stakeTree = async (row, col) => {
  //   if (
  //     !signer ||
  //     !contracts?.treeStakingContract ||
  //     !contracts?.treeNftContract
  //   ) {
  //     console.error("Signer or contracts not available");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const treeNftWithSigner = contracts.treeNftContract.connect(signer);
  //     const treeStakingAddress = contracts.treeStakingContract.target;
  //     await checkAndApproveForStaking(treeNftWithSigner, treeStakingAddress);

  //     const treeStakingWithSigner =
  //       contracts.treeStakingContract.connect(signer);

  //     // Stake işlemini gerçekleştir
  //     const stakeTx = await treeStakingWithSigner.stake(row, col);
  //     await stakeTx.wait();

  //     console.log("NFT staked successfully");
  //     // fetchStakedNFTDetails();
  //   } catch (error) {
  //     console.error("Error staking NFT:", error);
  //   }
  //   setLoading(false);
  // };

  // const stakeTractor = async (row, col) => {
  //   if (
  //     !signer ||
  //     !contracts?.tractorStakingContract ||
  //     !contracts?.tractorNftContract
  //   ) {
  //     console.error("Signer or contracts not available");
  //     return;
  //   }
  //   setLoading(true);

  //   try {
  //     const tractorNftWithSigner = contracts.tractorNftContract.connect(signer);
  //     const tractorStakingAddress = contracts.tractorStakingContract.target;
  //     await checkAndApproveForStaking(
  //       tractorNftWithSigner,
  //       tractorStakingAddress
  //     );

  //     const tractorStakingWithSigner =
  //       contracts.tractorStakingContract.connect(signer);

  //     // Stake işlemini gerçekleştir
  //     const stakeTx = await tractorStakingWithSigner.stake(row, col);
  //     await stakeTx.wait();

  //     console.log("NFT staked successfully");
  //     // fetchStakedNFTDetails();
  //   } catch (error) {
  //     console.error("!!Error staking NFT:", error);
  //   }
  //   setLoading(false);
  // };

  // const stake = async ({ item, row, col }) => {
  //   if (item.title === "tree") {
  //     await stakeTree(row, col);
  //   } else if (item.title === "tractor") {
  //     await stakeTractor(row, col);
  //   } else {
  //     alert("Unknown item type. Cannot stake.");
  //   }
  // };

  const checkAndApproveForStaking = async (
    nftWithSigner,
    treeStakingAddress
  ) => {
    const isApproved = await nftWithSigner.isApprovedForAll(
      userAddress,
      treeStakingAddress
    );

    if (!isApproved) {
      const approvePromise = new Promise(async (resolve, reject) => {
        try {
          const approveTx = await nftWithSigner.setApprovalForAll(
            treeStakingAddress,
            true
          );
          await approveTx.wait();
          resolve("Approval granted for staking");
        } catch (error) {
          reject(error);
        }
      });

      await toast.promise(
        approvePromise,
        {
          pending: "Approving NFT for staking...",
          success: "NFT approved for staking!",
          error: "Failed to approve NFT for staking",
        },
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
    }
  };

  const handleStakeTree = async (row, col) => {
    setLoading(true);
    const stakePromise = new Promise(async (resolve, reject) => {
      try {
        const result = await stakeTree(row, col);
        onLoadGame();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    try {
      await toast.promise(
        stakePromise,
        {
          pending: "Staking Tree NFT...",
          success: {
            render({ data }) {
              return `${data}`;
            },
          },
          error: {
            render({ data }) {
              return `Failed to stake Tree NFT: ${data.message}`;
            },
          },
        },
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
      // fetchStakedNFTDetails();
    } catch (error) {
      console.error("Error staking Tree NFT:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStakeTractor = async (row, col) => {
    setLoading(true);

    const stakePromise = new Promise(async (resolve, reject) => {
      try {
        const result = await stakeTractor(row, col);
        onLoadGame();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    try {
      await toast.promise(
        stakePromise,
        {
          pending: "Staking Tractor NFT...",
          success: {
            render({ data }) {
              return `${data}`;
            },
          },
          error: {
            render({ data }) {
              return `Failed to stake Tractor NFT: ${data.message}`;
            },
          },
        },
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
      // fetchStakedNFTDetails();
    } catch (error) {
      console.error("Error staking Tractor NFT:", error);
    } finally {
      setLoading(false);
    }
  };

  const stake = async ({ item, row, col }) => {
    if (item.title === "tree") {
      await handleStakeTree(row, col);
    } else if (item.title === "tractor") {
      await handleStakeTractor(row, col);
    } else {
      toast.error("Unknown item type. Cannot stake.");
    }
  };

  // async function updateLand(row, col, newState, resourceAmount) {
  //   if (!contracts?.landGameContract || !signer) {
  //     console.log("Contract or signer is not available.");
  //     return;
  //   }
  //   try {
  //     setClaimLoading(true);
  //     const contractWithSigner = contracts?.landGameContract.connect(signer);
  //     const tx = await contractWithSigner.updateLandAndUseResources(
  //       row,
  //       col,
  //       newState, // Örneğin "grass", "tree", "tractor"
  //       resourceAmount,
  //       { gasLimit: 300000 }
  //     );

  //     await tx.wait(); // İşlemin blok zincirinde onaylanmasını bekleyin
  //     console.log("!!Land updated and resources used successfully!");
  //   } catch (error) {
  //     setClaimLoading(false);
  //     console.error("Error updating land and using resources:", error);
  //   }
  // }

  async function handleUpdateLand(row, col, newState, resourceAmount) {
    const updateLandPromise = new Promise(async (resolve, reject) => {
      try {
        setClaimLoading(true);
        const result = await updateLand(row, col, newState, resourceAmount);
        resolve(result);
      } catch (error) {
        console.error("Error updating land and using resources:", error);
        reject(error);
      } finally {
        setClaimLoading(false);
      }
    });

    toast.promise(
      updateLandPromise,
      {
        pending: {
          render() {
            return `Updating land to ${newState}...`;
          },
          icon: "🔄",
        },
        success: {
          render({ data }) {
            return `${data}`;
          },
          icon: "🌳",
        },
        error: {
          render({ data }) {
            return `Failed to update land: ${data.message}`;
          },
          icon: "❌",
        },
      },
      {
        position: "top-center",
        autoClose: 5000,
      }
    );

    try {
      await updateLandPromise;
      onLoadGame();
    } catch (error) {}
  }

  async function fetchResourceBalance() {
    try {
      const balance = await getResourceBalance();
      setKaynak(balance);
    } catch (error) {
      console.error("Error fetching resource balance:", error);
    }
  }

  async function fetchLastClaimTime() {
    try {
      const lastTime = await getLastClaimTime();
      setLastClaimTime(lastTime);
    } catch (error) {
      console.error("Error fetching last resource claim time:", error);
    }
  }

  async function handleClaimResource() {
    const claimPromise = new Promise(async (resolve, reject) => {
      try {
        const result = await claimResource();
        resolve(result);
      } catch (error) {
        console.error("Error claiming resource:", error);
        reject(error);
      }
    });

    toast.promise(
      claimPromise,
      {
        pending: {
          render() {
            return "Claiming resource...";
          },
          icon: "🕒",
        },
        success: {
          render({ data }) {
            return `${data}`;
          },
          icon: "🎉",
        },
        error: {
          render({ data }) {
            return `Failed to claim resource: ${data.message}`;
          },
          icon: "❌",
        },
      },
      {
        position: "top-center",
        autoClose: 3000,
      }
    );

    try {
      await claimPromise;
      fetchResourceBalance();
      fetchLastClaimTime();
    } catch (error) {
    } finally {
      setClaimLoading(false);
    }
  }

  const openModalWithContent = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };

  return (
    <>
      {!playGame && (
        <Info
          openModalWithContent={openModalWithContent}
          setIsModalOpen={setIsModalOpen}
          error={errorMessage}
          loading={loading}
          setPlayGame={setPlayGame}
          claimLand={handleClaimLand}
        />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        {modalContent}
      </Modal>

      <LeftMenu
        claimLoading={claimLoading}
        claimResource={handleClaimResource}
        lastClaimTime={lastClaimTime}
        para={para}
        kaynak={kaynak}
        openModalWithContent={openModalWithContent}
        setIsModalOpen={setIsModalOpen}
      />
      <EmptyGame
        stake={stake}
        // fetchStakedNFTDetails={fetchStakedNFTDetails}
        // calculateTimeRemaining={calculateTimeRemaining}
        updateGmoveBalance={getBalanceGMOVE}
        stakedNFTDetails={stakedNFTDetails}
        stakeLoading={stakeLoading}
        updateLand={handleUpdateLand}
        setGridState={setGridState}
        gridState={gridState}
        playGame={playGame}
        setPlayGame={setPlayGame}
        kaynak={kaynak}
        setKaynak={setKaynak}
        openModalWithContent={openModalWithContent}
        claimResource={handleClaimResource}
        setIsModalOpen={setIsModalOpen}
        inventory={inventory}
        setInventory={setInventory}
        setSelectedItem={setSelectedItem}
        setShowSideMenu={setShowSideMenu}
        selectedItem={selectedItem}
        setSelectedContent={setSelectedContent}
      />
      <RightMenu
        landId={landID}
        getInventory={fetchInventory}
        updateGmoveBalance={getBalanceGMOVE}
        setShowSideMenu={setShowSideMenu}
        showSideMenu={showSideMenu}
        selectedContent={selectedContent}
        setSelectedContent={setSelectedContent}
        inventory={inventory}
        setInventory={setInventory}
        setIsModalOpen={setIsModalOpen}
        openModalWithContent={openModalWithContent}
        // handlePurchase={handlePurchase}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        //
        claimResource={handleClaimResource}
        setKaynak={setKaynak}
        //
        kaynak={kaynak}
        para={para}
      />
    </>
  );
};

export default Page;
