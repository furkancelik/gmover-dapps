"use client";
import { useSession, signOut } from "next-auth/react";
import DiscordLoginButton from "./DiscordLoginButton";
import GuildCheck from "./GuildCheck";
import RoleCheck from "./RoleCheck";
import { GET_SPECIFIC_TASK } from "@/graphql/queries/task";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { FaCheck, FaGift } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export default function TaskItem({
  children: Children,
  landId,
  taskId,
  // children,
  complateTitle,
  rewardsTitle,
}) {
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const {
    data: taskData,
    loading: taskLoading,
    refetch,
    error,
  } = useQuery(GET_SPECIFIC_TASK, {
    variables: {
      landId: landId,
      taskId: taskId,
    },
    skip: !landId, // landId yoksa sorguyu atla
  });

  useEffect(() => {
    if (taskData?.getSpecificTask) {
      setIsTaskCompleted(true);
    }
  }, [taskData]);

  if (!landId) return null;

  if (taskLoading) return <div>Loading...</div>;

  if (isTaskCompleted) {
    return (
      <>
        <p className="line-through opacity-60">{complateTitle}</p>
        <FaCheck className="ml-2 cursor-pointer outline-none" color="#42280f" />
      </>
    );
  } else {
    // console.log("childComponent");
    // const childComponent = useMemo(() => {
    //   return ;
    // }, [Children, refetch]);

    return (
      <>
        <div>
          <Children refetch={refetch} />
        </div>
        <div className="">
          <FaGift
            id={`tooltip-discord`}
            className="ml-2 cursor-pointer outline-none"
            color="#42280f"
          />
          <Tooltip className=" !rounded-xl" anchorSelect={`#tooltip-discord`}>
            {rewardsTitle}
          </Tooltip>
        </div>
      </>
    );
  }
}
