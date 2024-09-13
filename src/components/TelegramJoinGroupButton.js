"use client";

import { useEthereum } from "@/context/EthereumContext";
import { ADD_TASK } from "@/graphql/queries/task";
import { useMutation } from "@apollo/client";
import { useSession } from "next-auth/react";

export default function TelegramJoinGroupButton({ landId, refetch }) {
  const { userAddress } = useEthereum();
  const [addTask] = useMutation(ADD_TASK);
  const { data: session } = useSession();

  const handleAddTask = async () => {
    if (!userAddress) return null;
    try {
      await addTask({
        variables: {
          userId: userAddress,
          landId: landId,
          taskId: "TELEGRAM_JOIN",
          xpReward: 100,
        },
      });
      refetch();
      //   refetchTasks();
      //   refetchTotalXp();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleFollowClick = () => {
    setTimeout(() => {
      handleAddTask();
    }, 4000);
    window.open("https://t.me/Gmoverxyz", "_blank");
  };

  return <div onClick={handleFollowClick}>Join our Telegram Group</div>;
}
