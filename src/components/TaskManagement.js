import React, { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_TOTAL_XP_REWARD,
  GET_TASKS,
  ADD_TASK,
} from "@/graphql/queries/task";

const TaskManagement = ({ landId }) => {
  const { data: totalXpData, refetch: refetchTotalXp } = useQuery(
    GET_TOTAL_XP_REWARD,
    { variables: { landId: landId } }
  );

  return (
    <div>
      <h3>Total XP Reward:</h3>
      <p>{totalXpData?.getTotalXpReward || 0}</p>
    </div>
  );
};

export default TaskManagement;
