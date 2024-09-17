// src/utils/contractHelpers.js
import {
  useReadContract,
  useWriteContract,
  useAccount,
  useBalance,
} from "wagmi";
import { CONTRACTS } from "./contractInfo";
import { parseEther, formatEther } from "viem";

// Land Game kontrat işlemleri
export const useLandState = () => {
  const t = useReadContract({
    address: CONTRACTS.landGameContract.address,
    abi: CONTRACTS.landGameContract.abi,
    functionName: "getLandState",
  });
  console.log(
    t?.error?.cause?.reason,
    "TTTT",
    {
      address: CONTRACTS.landGameContract.address,
      abi: CONTRACTS.landGameContract.abi,
      functionName: "getLandState",
    },
    t
  );
  return t;
};

export const useClaimLand = () => {
  return useWriteContract({
    address: CONTRACTS.landGameContract.address,
    abi: CONTRACTS.landGameContract.abi,
    functionName: "claimLand",
  });
};

// GMOVE Token işlemleri
export const useGMOVEBalance = (address) => {
  return useBalance({
    address,
    token: CONTRACTS.gmoveTokenContract.address,
  });
};

// Inventory işlemleri
export const useInventory = () => {
  const { address } = useAccount();
  const { data: treeBalance } = useReadContract({
    address: CONTRACTS.treeNftContract.address,
    abi: CONTRACTS.treeNftContract.abi,
    functionName: "balanceOf",
    args: [address, BigInt(0)],
  });
  const { data: tractorBalance } = useReadContract({
    address: CONTRACTS.tractorNftContract.address,
    abi: CONTRACTS.tractorNftContract.abi,
    functionName: "balanceOf",
    args: [address, BigInt(1)],
  });

  const inventoryItems = [];
  if (treeBalance && treeBalance > 0n) {
    inventoryItems.push({
      title: "tree",
      image: "/agac.png",
      quantity: treeBalance.toString(),
    });
  }
  if (tractorBalance && tractorBalance > 0n) {
    inventoryItems.push({
      title: "tractor",
      image: "/tractor.png",
      quantity: tractorBalance.toString(),
    });
  }
  return inventoryItems;
};

export const useStakeTree = () => {
  return useWriteContract({
    address: CONTRACTS.treeStakingContract.address,
    abi: CONTRACTS.treeStakingContract.abi,
    functionName: "stake",
  });
};

export const useStakeTractor = () => {
  return useWriteContract({
    address: CONTRACTS.tractorStakingContract.address,
    abi: CONTRACTS.tractorStakingContract.abi,
    functionName: "stake",
  });
};

export const useUpdateLand = () => {
  return useWriteContract({
    address: CONTRACTS.landGameContract.address,
    abi: CONTRACTS.landGameContract.abi,
    functionName: "updateLandAndUseResources",
  });
};

export const useResourceBalance = () => {
  const { address } = useAccount();
  return useReadContract({
    address: CONTRACTS.landGameContract.address,
    abi: CONTRACTS.landGameContract.abi,
    functionName: "resources",
    args: [address],
  });
};

export const useLastClaimTime = () => {
  return useReadContract({
    address: CONTRACTS.landGameContract.address,
    abi: CONTRACTS.landGameContract.abi,
    functionName: "getLastResourceClaimTime",
  });
};

export const useClaimResource = () => {
  return useWriteContract({
    address: CONTRACTS.landGameContract.address,
    abi: CONTRACTS.landGameContract.abi,
    functionName: "claimResource",
  });
};

export const useGetNFTDetails = (itemType, row, col) => {
  const contractKey =
    itemType === "tree" ? "treeStakingContract" : "tractorStakingContract";
  const { address } = useAccount();

  return useReadContract({
    address: CONTRACTS[contractKey].address,
    abi: CONTRACTS[contractKey].abi,
    functionName: "getUpdatedStakeInfo",
    args: [address, BigInt(row), BigInt(col)],
  });
};

export const useUnstakeItem = (itemType) => {
  const contractKey =
    itemType === "tree" ? "treeStakingContract" : "tractorStakingContract";

  return useWriteContract({
    address: CONTRACTS[contractKey].address,
    abi: CONTRACTS[contractKey].abi,
    functionName: "unstake",
  });
};

export const useClaimRewardForItem = (itemType) => {
  const contractKey =
    itemType === "tree" ? "treeStakingContract" : "tractorStakingContract";

  return useWriteContract({
    address: CONTRACTS[contractKey].address,
    abi: CONTRACTS[contractKey].abi,
    functionName: "claimReward",
  });
};

export const useBuyTree = () => {
  return useWriteContract({
    address: CONTRACTS.treeNftContract.address,
    abi: CONTRACTS.treeNftContract.abi,
    functionName: "buyTree",
  });
};

export const useBuyTractor = () => {
  return useWriteContract({
    address: CONTRACTS.tractorNftContract.address,
    abi: CONTRACTS.tractorNftContract.abi,
    functionName: "buyTractor",
  });
};

export const useHandlePurchase = (item) => {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: CONTRACTS.gmoveTokenContract.address,
  });
  const { writeContractAsync: buyTree } = useBuyTree();
  const { writeContractAsync: buyTractor } = useBuyTractor();

  const handlePurchase = async () => {
    const itemCost = parseEther(item.price.toString());
    if (balance && balance.value >= itemCost) {
      if (item.type === "tree") {
        await buyTree({ args: [BigInt(1)] });
      } else if (item.type === "tractor") {
        await buyTractor({ args: [BigInt(1)] });
      }
    } else {
      throw new Error("Insufficient GMOVE balance");
    }
  };

  return handlePurchase;
};
