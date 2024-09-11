import useRemainingTime from "@/utils/remainingTime";
import { useEffect, useState } from "react";

const ClaimTimer = ({ time, claimComponent, ParentComponent }) => {
  const remainingTime = useRemainingTime(time);

  const [displayTime, setDisplayTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (remainingTime !== null) {
      const hours = Math.floor(remainingTime / 3600);
      const minutes = Math.floor((remainingTime % 3600) / 60);
      const seconds = remainingTime % 60;
      setDisplayTime({
        hours,
        minutes,
        seconds,
      });
    }
  }, [remainingTime]);

  if (remainingTime > 0) {
    return (
      <div className="absolute w-full text-center text-sm top-1/2 -translate-y-1/2 text-black text-opacity-80">
        <div className="flex items-center justify-center font-bold ">
          <div className="flex flex-col  items-center font-medium ">
            <div
              key={displayTime.hours}
              style={{ animation: "slideDown 0.5s ease-in-out forwards" }}
            >
              {displayTime.hours < 10
                ? `0${displayTime.hours}`
                : `${displayTime.hours}`}
            </div>
            {/* <span className="text-sm font-normal">hours</span> */}
          </div>
          <p>:</p>
          <div className="flex flex-col  items-center font-medium ">
            <div
              key={displayTime.minutes}
              style={{ animation: "slideDown 0.5s ease-in-out forwards" }}
            >
              {displayTime.minutes < 10
                ? `0${displayTime.minutes}`
                : `${displayTime.minutes}`}
            </div>
            {/* <span className="text-sm font-normal">minutes</span> */}
          </div>
          <p>:</p>
          <div className="flex flex-col  items-center font-medium ">
            <div
              key={displayTime.seconds}
              style={{ animation: "slideDown 0.5s ease-in-out forwards" }}
            >
              {displayTime.seconds < 10
                ? `0${displayTime.seconds}`
                : `${displayTime.seconds}`}
            </div>
            {/* <span className="text-sm font-normal">seconds</span> */}
          </div>
        </div>
      </div>
    );
  } else {
    return claimComponent();
  }
};

export default ClaimTimer;
