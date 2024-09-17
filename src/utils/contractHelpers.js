// src/utils/contractHelpers.js

import { ethers } from "ethers";
import { CONTRACTS } from "./contractInfo";

// Signer ve provider'ı saklayacak değişkenler
let _signer = null;
let _provider = null;

// Signer ve provider'ı set eden fonksiyon
export const setEthereumConnection = (signer, provider) => {
  _signer = signer;
  _provider = provider;
};

// Kontrat instance'ı oluşturan yardımcı fonksiyon
const getContractInstance = (contractName) => {
  if (!_signer) {
    throw new Error("Signer is not available");
  }
  const contractInfo = CONTRACTS[contractName];
  return new ethers.Contract(contractInfo.address, contractInfo.ABI, _signer);
};

// Land Game kontrat işlemleri
export const getLandState = async () => {
  const contract = getContractInstance("landGameContract");
  const landState = await contract.getLandState();
  return JSON.parse(JSON.stringify(landState));
};

export const claimLand = async () => {
  const contract = getContractInstance("landGameContract");
  const tx = await contract.claimLand();
  await tx.wait();
  return "Land claimed successfully!";
};

// GMOVE Token işlemleri
export const getGMOVEBalance = async (address) => {
  const contract = getContractInstance("gmoveTokenContract");
  try {
    const balance = await contract.balanceOf(address);
    return ethers.formatEther(balance);
  } catch (e) {
    console.log("HAAAT:", e);
  }
};

// Inventory işlemleri
export const getInventory = async (address) => {
  const treeContract = getContractInstance("treeNftContract");
  const tractorContract = getContractInstance("tractorNftContract");

  const treeBalance = await treeContract.balanceOf(address, 0);
  const tractorBalance = await tractorContract.balanceOf(address, 1);

  const inventoryItems = [];

  if (treeBalance > 0) {
    inventoryItems.push({
      title: "tree",
      image: "/agac.png",
      quantity: treeBalance.toString(),
    });
  }

  if (tractorBalance > 0) {
    inventoryItems.push({
      title: "tractor",
      image: "/tractor.png",
      quantity: tractorBalance.toString(),
    });
  }

  return inventoryItems;
};

// Diğer kontrat işlemleri buraya eklenebilir...

export const checkAndApproveForStaking = async (
  nftContractName,
  stakingContractName
) => {
  const nftContract = getContractInstance(nftContractName);
  const stakingContract = getContractInstance(stakingContractName);
  const userAddress = await _signer.getAddress();

  const isApproved = await nftContract.isApprovedForAll(
    userAddress,
    stakingContract.target
  );

  if (!isApproved) {
    const approveTx = await nftContract.setApprovalForAll(
      stakingContract.target,
      true
    );
    await approveTx.wait();
    return "Approval granted for staking";
  }
  return "Already approved for staking";
};

export const stakeTree = async (row, col) => {
  await checkAndApproveForStaking("treeNftContract", "treeStakingContract");
  console.log("ok");
  const contract = getContractInstance("treeStakingContract");
  const tx = await contract.stake(row, col);
  await tx.wait();
  return `Tree NFT staked successfully at (${row}, ${col})`;
};

export const stakeTractor = async (row, col) => {
  await checkAndApproveForStaking(
    "tractorNftContract",
    "tractorStakingContract"
  );
  const contract = getContractInstance("tractorStakingContract");
  const tx = await contract.stake(row, col);
  await tx.wait();
  return `Tractor NFT staked successfully at (${row}, ${col})`;
};

export const updateLand = async (row, col, newState, resourceAmount) => {
  const contract = getContractInstance("landGameContract");
  const tx = await contract.updateLandAndUseResources(
    row,
    col,
    newState,
    resourceAmount
  );
  await tx.wait();
  return `Land at (${row},${col}) updated to ${newState} successfully!`;
};

export const getResourceBalance = async () => {
  const contract = getContractInstance("landGameContract");
  const userAddress = await _signer.getAddress();
  const resourceBalance = await contract.resources(userAddress);
  return parseInt(resourceBalance.toString());
};

export const getLastClaimTime = async () => {
  const contract = getContractInstance("landGameContract");
  const lastClaimTime = await contract.getLastResourceClaimTime();
  return parseInt(lastClaimTime.toString());
};

export const claimResource = async () => {
  const contract = getContractInstance("landGameContract");
  const tx = await contract.claimResource();
  await tx.wait();
  return "Resource claimed successfully!";
};

export const getTractorNFTDetails = async (row, col) => {
  const contract = getContractInstance("tractorStakingContract");
  const userAddress = await _signer.getAddress();
  const details = await contract.getUpdatedStakeInfo(userAddress, row, col);

  return {
    stakedAt: new Date(parseInt(details?.stakedAt) * 1000),
    pendingReward: ethers.formatEther(details?.pendingReward),
    stakedDuration: parseInt(details.stakedDuration),
  };
};

export const getTreeNFTDetails = async (row, col) => {
  const contract = getContractInstance("treeStakingContract");
  const userAddress = await _signer.getAddress();
  const details = await contract.getUpdatedStakeInfo(userAddress, row, col);

  return {
    stakedAt: new Date(parseInt(details?.stakedAt) * 1000),
    pendingReward: ethers.formatEther(details?.pendingReward),
    stakedDuration: parseInt(details.stakedDuration),
  };
};

export const getNFTDetails = async (itemType, row, col) => {
  if (itemType === "tree") {
    return getTreeNFTDetails(row, col);
  } else if (itemType === "tractor") {
    return getTractorNFTDetails(row, col);
  }
  throw new Error("Unknown item type");
};

export const unstakeItem = async (row, col, itemType) => {
  const contractKey =
    itemType === "tree" ? "treeStakingContract" : "tractorStakingContract";
  const contract = getContractInstance(contractKey);
  const tx = await contract.unstake(row, col);
  await tx.wait();
  return `${
    itemType.charAt(0).toUpperCase() + itemType.slice(1)
  } unstaked successfully from (${row}, ${col})`;
};

export const claimRewardForItem = async (row, col, itemType) => {
  const contractKey =
    itemType === "tree" ? "treeStakingContract" : "tractorStakingContract";
  const contract = getContractInstance(contractKey);
  const tx = await contract.claimReward(row, col);
  await tx.wait();
  return `${
    itemType.charAt(0).toUpperCase() + itemType.slice(1)
  } reward claimed successfully for (${row}, ${col})`;
};

export const buyTree = async (item) => {
  const treeNftContract = getContractInstance("treeNftContract");
  const gmoveTokenContract = getContractInstance("gmoveTokenContract");
  const totalPrice = ethers.parseUnits(item.price.toString(), 18);

  // GMOVE token'ı TreeNFT kontratına transfer etmek için onay veriyoruz
  const approveTx = await gmoveTokenContract.approve(
    treeNftContract.target,
    totalPrice
  );
  await approveTx.wait();

  // buyTree fonksiyonunu çağırıyoruz
  const buyTx = await treeNftContract.buyTree(1);
  await buyTx.wait();

  return "Tree NFT purchased successfully!";
};

export const buyTractor = async (item) => {
  const tractorNftContract = getContractInstance("tractorNftContract");
  const gmoveTokenContract = getContractInstance("gmoveTokenContract");
  const totalPrice = ethers.parseUnits(item.price.toString(), 18);

  // GMOVE token'ı TractorNFT kontratına transfer etmek için onay veriyoruz
  const approveTx = await gmoveTokenContract.approve(
    tractorNftContract.target,
    totalPrice
  );
  await approveTx.wait();

  // buyTractor fonksiyonunu çağırıyoruz
  const buyTx = await tractorNftContract.buyTractor(1);
  await buyTx.wait();

  return "Tractor NFT purchased successfully!";
};

export const handlePurchase = async (item) => {
  const gmoveTokenContract = getContractInstance("gmoveTokenContract");
  const userAddress = await _signer.getAddress();
  const balance = await gmoveTokenContract.balanceOf(userAddress);
  const balanceBN = BigInt(balance);
  const itemCost = ethers.parseUnits(item.price.toString(), 18);

  if (balanceBN >= itemCost) {
    if (item.type === "tree") {
      return await buyTree(item);
    } else if (item.type === "tractor") {
      return await buyTractor(item);
    }
  } else {
    throw new Error("Insufficient GMOVE balance");
  }
};
