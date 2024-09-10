import { RESOURCE_CLAIM_INTERVAL } from "@/constants/resource";
import { useEffect, useState } from "react";

const useRemainingTime = (time) => {
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    const calculateRemainingTime = async () => {
      try {
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const nextClaimTime = time + RESOURCE_CLAIM_INTERVAL;

        const timeRemaining =
          nextClaimTime > currentTime ? nextClaimTime - currentTime : 0;

        setRemainingTime(timeRemaining);
      } catch (e) {
        console.error("ERROR:", e);
      }
    };

    calculateRemainingTime();
    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [time]);
  return remainingTime;
};

export default useRemainingTime;
