"use client";

import React, { useEffect, useState } from "react";
import { ADD_TASK, GET_SPECIFIC_TASK } from "@/graphql/queries/task";
import { useMutation, useQuery } from "@apollo/client";
import { useSession, signIn } from "next-auth/react";
import { UPDATE_TWITTER } from "@/graphql/queries/land";

const TwitterConnectButton = ({ landId, refetch }) => {
  const [addTask] = useMutation(ADD_TASK);
  const [updateTwitter] = useMutation(UPDATE_TWITTER);

  const { data: session } = useSession();

  useEffect(() => {
    //
  }, [session?.twitter]);

  const handleAddTask = async () => {
    try {
      if (session?.twitter) {
        // Twitter bilgilerini güncelle
        await updateTwitter({
          variables: {
            landId: landId,
            twitter: {
              id: session?.user?.id,
              screen_name: session?.user?.name,
            },
          },
        });
      }
      await addTask({
        variables: {
          userId: session?.twitter?.id,
          landId: landId,
          taskId: "TWITTER_FOLLOW",
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
    window.open(
      "https://twitter.com/intent/follow?screen_name=Gmover_xyz",
      "_blank"
    );
  };

  const handleTwitterConnect = () => {
    signIn("twitter", { callbackUrl: "/" }); // '/profile' yerine istediğiniz callback URL'i koyabilirsiniz
  };

  if (!session?.twitter) {
    return <div onClick={handleTwitterConnect}>Connect Twitter</div>;
  }

  return <div onClick={handleFollowClick}>Follow us on Twitter.</div>;
};

export default TwitterConnectButton;
