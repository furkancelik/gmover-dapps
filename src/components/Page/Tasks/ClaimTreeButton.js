import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ADD_TASK } from "@/graphql/queries/task";
import { useMutation } from "@apollo/client";
import { useEthereum } from "@/context/EthereumContext";
import { setEthereumConnection, getLandState } from "@/utils/contractHelpers";

const ClaimTreeButton = ({
  landId,
  taskId,
  xpReward,
  refetch,
  treeSize = 1,
}) => {
  const { contracts, signer, provider, userAddress } = useEthereum();
  const [addTask] = useMutation(ADD_TASK);
  const [hasTreeArea, setHasTreeArea] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskAdded, setIsTaskAdded] = useState(false);
  useEffect(() => {
    if (signer && provider) {
      setEthereumConnection(signer, provider);
      if (!isTaskAdded) checkTreeState();
    }
  }, [signer, provider, isTaskAdded]);

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

  const checkTreeState = useCallback(async () => {
    try {
      setIsLoading(true);
      const landStateArray = await getLandState();
      const treeCount = countTree(landStateArray);
      setHasTreeArea(treeCount > 0);
      if (treeCount >= treeSize && !isTaskAdded) {
        await handleAddTask();
      }
    } catch (error) {
      console.error("Error fetching land state:", error);
    } finally {
      setIsLoading(false);
    }
  }, [contracts, signer, isTaskAdded, handleAddTask]);

  const countTree = (landStateArray) => {
    return landStateArray.reduce((count, row) => {
      return count + row.filter((cell) => cell === "tree").length;
    }, 0);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{hasTreeArea ? "1 tree was staked." : "Stake 1 tree."}</div>;
};

export default ClaimTreeButton;
