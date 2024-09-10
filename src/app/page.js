"use client";
import { useEffect, useRef, useState } from "react";

import { useEthereum } from "../context/EthereumContext";
import { ethers } from "ethers";
import useContractEvent from "@/hooks/useContractEvent";
import Modal from "@/components/Modal";

import LeftMenu from "@/components/Layout/LeftMenu";
import RightMenu from "@/components/Layout/RightMenu";
import GameScene from "@/components/GameScene";
import EmptyGame from "@/components/GameScene/EmptyGame";
import Info from "@/components/Info";

import { CREATE_LAND, GET_LAND } from "@/graphql/queries/land";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GRID_SIZE } from "@/constants/grid";
import { toast } from "react-toastify";

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
    if (!contracts?.landGameContract || !signer) {
      console.log("Contract or signer is not available.");
      return;
    }

    try {
      // Contract'ı signer ile bağlayın
      const contractWithSigner = contracts?.landGameContract.connect(signer);

      const landState = await contractWithSigner.getLandState();
      const landStateAar = JSON.parse(JSON.stringify(landState));
      //TODO:çektiğin veriyi güncelle
      setGridState(landStateAar);
      setLoading(false);
      setPlayGame(true);
      getLastClaimTime();
      getResourceBalance();

      try {
        await createLand({
          variables: {
            input: {
              walletAddress: userAddress,
              gridState: landStateAar,
              resources: kaynak || 0,
            },
          },
        });
      } catch (e) {
        console.error("Error creating land:", e);
      }
    } catch (error) {
      if (error.reason === "You need to claim your land first.") {
        setLoading(false);
      } else {
        setErrorMessage(error.message);
        console.log("ERROR", error);
        // alert("beklenmedik bir hata meydana geldi!");
      }
    }
  }

  async function claimLand() {
    if (!contracts?.landGameContract || !signer) {
      console.log("Contract or signer is not available.");
      return;
    }
    const claimLandPromise = new Promise(async (resolve, reject) => {
      try {
        const contractWithSigner = contracts?.landGameContract.connect(signer);
        const tx = await contractWithSigner.claimLand();
        await tx.wait();
        resolve("Land claimed successfully!");
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
    if (!contracts?.gmoveTokenContract || !signer) {
      console.log("Contract or signer is not available.");
      return;
    }
    try {
      const balance = await contracts.gmoveTokenContract.balanceOf(userAddress);
      setPara(parseFloat(ethers.formatEther(balance)).toFixed(2));
    } catch (error) {
      console.error("Error fetching GMOVE balance:", error);
    }
  }

  useEffect(() => {
    onLoadGame();
    getBalanceGMOVE();
  }, [userAddress, contracts?.landGameContract, signer]);

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
        console.log("!ResourceClaimedKaynak", parseInt(amount.toString()));
        setKaynak(parseInt(amount.toString()));
        getLastClaimTime();
        setClaimLoading(false);
      }
    }
  );

  useContractEvent(
    "ResourceSpent",
    contracts?.landGameContract,
    (user, amount) => {
      if (user.toLowerCase() === userAddress.toLowerCase()) {
        console.log("!ResourceSpent", parseInt(amount.toString()));
        setKaynak(parseInt(amount.toString()));
        getLastClaimTime();
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
      console.log("ResourceClaimed::");
      if (user.toLowerCase() === userAddress.toLowerCase()) {
        console.log("!ResourceClaimedKaynak", parseInt(amount.toString()));
        setKaynak(parseInt(amount.toString()));
        getLastClaimTime();
        setClaimLoading(false);
      }
    }
  );

  const checkAndApproveForStaking = async (
    nftWithSigner,
    treeStakingAddress
  ) => {
    const treeNftWithSigner = contracts.treeNftContract.connect(signer);
    const isApproved = await nftWithSigner.isApprovedForAll(
      userAddress,
      treeStakingAddress
      // contracts.treeStakingContract.target
    );

    if (!isApproved) {
      const approveTx = await nftWithSigner.setApprovalForAll(
        treeStakingAddress,
        true
      );
      await approveTx.wait();
      console.log("Approval granted for staking");
    }
  };

  const stakeTree = async (row, col) => {
    if (
      !signer ||
      !contracts?.treeStakingContract ||
      !contracts?.treeNftContract
    ) {
      console.error("Signer or contracts not available");
      return;
    }
    setLoading(true);
    try {
      const treeNftWithSigner = contracts.treeNftContract.connect(signer);
      const treeStakingAddress = contracts.treeStakingContract.target;
      await checkAndApproveForStaking(treeNftWithSigner, treeStakingAddress);

      const treeStakingWithSigner =
        contracts.treeStakingContract.connect(signer);

      // Stake işlemini gerçekleştir
      const stakeTx = await treeStakingWithSigner.stake(row, col);
      await stakeTx.wait();

      console.log("NFT staked successfully");
      // fetchStakedNFTDetails();
    } catch (error) {
      console.error("Error staking NFT:", error);
    }
    setLoading(false);
  };

  const stakeTractor = async (row, col) => {
    if (
      !signer ||
      !contracts?.tractorStakingContract ||
      !contracts?.tractorNftContract
    ) {
      console.error("Signer or contracts not available");
      return;
    }
    setLoading(true);

    try {
      const tractorNftWithSigner = contracts.tractorNftContract.connect(signer);
      const tractorStakingAddress = contracts.tractorStakingContract.target;
      await checkAndApproveForStaking(
        tractorNftWithSigner,
        tractorStakingAddress
      );

      const tractorStakingWithSigner =
        contracts.tractorStakingContract.connect(signer);

      // Stake işlemini gerçekleştir
      const stakeTx = await tractorStakingWithSigner.stake(row, col);
      await stakeTx.wait();

      console.log("NFT staked successfully");
      // fetchStakedNFTDetails();
    } catch (error) {
      console.error("!!Error staking NFT:", error);
    }
    setLoading(false);
  };

  const stake = async ({ item, row, col }) => {
    if (item.title === "tree") {
      await stakeTree(row, col);
    } else if (item.title === "tractor") {
      await stakeTractor(row, col);
    } else {
      alert("Unknown item type. Cannot stake.");
    }
  };

  async function updateLand(row, col, newState, resourceAmount) {
    if (!contracts?.landGameContract || !signer) {
      console.log("Contract or signer is not available.");
      return;
    }
    try {
      setClaimLoading(true);
      const contractWithSigner = contracts?.landGameContract.connect(signer);
      const tx = await contractWithSigner.updateLandAndUseResources(
        row,
        col,
        newState, // Örneğin "grass", "tree", "tractor"
        resourceAmount,
        { gasLimit: 300000 }
      );

      await tx.wait(); // İşlemin blok zincirinde onaylanmasını bekleyin
      console.log("!!Land updated and resources used successfully!");
    } catch (error) {
      setClaimLoading(false);
      console.error("Error updating land and using resources:", error);
    }
  }

  async function getResourceBalance() {
    if (!contracts?.landGameContract || !signer) {
      console.log("Contract or signer is not available.");
      return;
    }
    try {
      // Contract'ı signer ile bağlayın
      const contractWithSigner = contracts?.landGameContract.connect(signer);
      // Kullanıcının kaynak değerini almak için resources mapping'ini çağırın
      const resourceBalance = await contractWithSigner.resources(userAddress);
      // Elde edilen kaynak değerini frontend'e set edelim
      console.log("Resource balance:", resourceBalance);
      setKaynak(parseInt(resourceBalance.toString()));
    } catch (error) {
      console.error("Error fetching resource balance:", error);
    }
  }

  async function getLastClaimTime() {
    if (!contracts?.landGameContract || !signer) {
      console.log("Contract or signer is not available.");
      return;
    }
    try {
      // Contract'ı signer ile bağlayın
      const contractWithSigner = contracts?.landGameContract.connect(signer);
      // getLastResourceClaimTime fonksiyonunu çağırın
      const lastClaimTime = await contractWithSigner.getLastResourceClaimTime();

      // Elde edilen zamanı frontend'e set edelim
      console.log("Last resource claim time:", lastClaimTime);
      setLastClaimTime(parseInt(lastClaimTime.toString()));
    } catch (error) {
      console.error("Error fetching last resource claim time:", error);
    }
  }

  async function claimResource() {
    if (!contracts?.landGameContract || !signer) {
      console.log("Contract or signer is not available.");
      toast.error("Contract or signer is not available.");
      return;
    }

    const claimPromise = new Promise(async (resolve, reject) => {
      try {
        const contractWithSigner = contracts?.landGameContract.connect(signer);
        const tx = await contractWithSigner.claimResource({ gasLimit: 300000 });
        await tx.wait();
        resolve("Resource claimed successfully!");
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
      getResourceBalance();
      getLastClaimTime();
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
          error={errorMessage}
          loading={loading}
          setPlayGame={setPlayGame}
          claimLand={claimLand}
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
        claimResource={claimResource}
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
        stakedNFTDetails={stakedNFTDetails}
        stakeLoading={stakeLoading}
        updateLand={updateLand}
        setGridState={setGridState}
        gridState={gridState}
        playGame={playGame}
        setPlayGame={setPlayGame}
        kaynak={kaynak}
        setKaynak={setKaynak}
        openModalWithContent={openModalWithContent}
        claimResource={claimResource}
        setIsModalOpen={setIsModalOpen}
        inventory={inventory}
        setInventory={setInventory}
        setSelectedItem={setSelectedItem}
        setShowSideMenu={setShowSideMenu}
        selectedItem={selectedItem}
        setSelectedContent={setSelectedContent}
      />

      <RightMenu
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
        claimResource={claimResource}
        setKaynak={setKaynak}
        //
        kaynak={kaynak}
        para={para}
      />
    </>
  );
};

export default Page;
