import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ADD_TASK } from "@/graphql/queries/task";
import { useMutation } from "@apollo/client";
import { useEthereum } from "@/context/EthereumContext";

const ClaimTreeButton = ({ landId, taskId, xpReward, refetch }) => {
  const { contracts, signer, userAddress } = useEthereum();
  const [addTask] = useMutation(ADD_TASK);
  const [hasGrassArea, setHasGrassArea] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskAdded, setIsTaskAdded] = useState(false);

  const handleAddTask = useCallback(async () => {
    if (isTaskAdded) return; // Eğer görev zaten eklendiyse, fonksiyonu erken sonlandır
    try {
      const result = await addTask({
        variables: {
          userId: userAddress,
          landId,
          taskId,
          xpReward,
        },
      });
      if (result.data.addTask) {
        setIsTaskAdded(true);
        refetch(); // Parent bileşenin query'sini yeniden çalıştır
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }, [addTask, userAddress, landId, taskId, xpReward, isTaskAdded, refetch]);

  const checkLandState = useCallback(async () => {
    if (!contracts?.landGameContract || !signer) {
      console.log("Contract or signer is not available.");
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const contractWithSigner = contracts.landGameContract.connect(signer);
      const landState = await contractWithSigner.getLandState();
      const landStateArray = JSON.parse(JSON.stringify(landState));

      const treeCount = countGrass(landStateArray);

      setHasGrassArea(treeCount > 0);
      if (treeCount >= 1 && !isTaskAdded) {
        await handleAddTask();
      }
    } catch (error) {
      console.error("Error fetching land state:", error);
    } finally {
      setIsLoading(false);
    }
  }, [contracts, signer, isTaskAdded, handleAddTask]);

  useEffect(() => {
    if (contracts?.landGameContract && signer && !isTaskAdded) {
      checkLandState();
    }
  }, [contracts, signer, isTaskAdded]);

  const countGrass = (landStateArray) => {
    return landStateArray.reduce((count, row) => {
      return count + row.filter((cell) => cell === "tree").length;
    }, 0);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{hasGrassArea ? "1 tree was staked." : "Stake 1 tree."}</div>;
};

export default ClaimTreeButton;
