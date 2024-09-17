import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ADD_TASK } from "@/graphql/queries/task";
import { useMutation } from "@apollo/client";
import { useEthereum } from "@/context/EthereumContext";
import { setEthereumConnection, getLandState } from "@/utils/contractHelpers";

const ClaimLandButton = ({
  landId,
  grassSize = 1,
  taskId,
  xpReward,
  refetch,
}) => {
  const { contracts, signer, provider, userAddress } = useEthereum();
  const [addTask] = useMutation(ADD_TASK);
  const [hasGrassArea, setHasGrassArea] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTaskAdded, setIsTaskAdded] = useState(false);

  useEffect(() => {
    if (signer && provider) {
      setEthereumConnection(signer, provider);
      if (!isTaskAdded) checkLandState();
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

  const checkLandState = useCallback(async () => {
    try {
      setIsLoading(true);
      const landStateArray = await getLandState();
      const grassCount = countGrass(landStateArray);

      setHasGrassArea(grassCount > 0);
      if (grassCount >= grassSize && !isTaskAdded) {
        await handleAddTask();
      }
    } catch (error) {
      console.error("Error fetching land state:", error);
    } finally {
      setIsLoading(false);
    }
  }, [contracts, signer, grassSize, isTaskAdded, handleAddTask]);

  const countGrass = (landStateArray) => {
    return landStateArray.reduce((count, row) => {
      return count + row.filter((cell) => cell === "grass").length;
    }, 0);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {hasGrassArea ? "1 arable land was claimed." : "Claim 1 arable area."}
    </div>
  );
};

export default ClaimLandButton;
