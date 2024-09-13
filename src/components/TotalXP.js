import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_TOTAL_XP_REWARD } from "@/graphql/queries/task";

const TotalXP = ({ landId }) => {
  const {
    data: totalXpData,
    loading,
    error,
    refetch: refetchTotalXp,
  } = useQuery(GET_TOTAL_XP_REWARD, {
    variables: { landId: landId },
    skip: !landId,
  });

  if (loading) return "Yükleniyor..";
  return totalXpData?.getTotalXpReward || 0;
};

export default TotalXP;
