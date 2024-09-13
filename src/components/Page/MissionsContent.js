import { FaCheck, FaGift } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import DiscordFlow from "../DiscordFlow";
import TaskManagement from "../TaskManagement";
import TwitterConnectButton from "../TwitterConnectButton";
import Profile from "../Profile";
import TaskItem from "../TaskItem";
import TelegramJoinGroupButton from "../TelegramJoinGroupButton";
import ClaimLandButton from "../ClaimLandButton";
import ClaimTreeButton from "../ClaimTreeButton";

const MissionsContent = ({ landId }) => (
  <div className="mb-4 mx-auto w-full">
    <h2 className="text-xl font-bold mt-2 mb-1 text-black">Tasks</h2>
    {/* <ul className="text-sm">
      {[
        {
          title: (
            <>
              Follow Us on{" "}
              <a
                className=" underline"
                href="https://x.com/Gmover_xyz"
                target="_blank"
              >
                Twitter.
              </a>
            </>
          ),
          gift: "You will earn +1 Resource",
          isOk: false,
        },
        {
          title: (
            <>
              Join our{" "}
              <a
                className=" underline"
                href="https://t.me/Gmoverxyz"
                target="_blank"
              >
                Telegram Group
              </a>
            </>
          ),
          gift: "You will earn +1 Resource",
          isOk: false,
        },
        { title: "Plant 1 Tree", gift: "You will earn +10XP", isOk: false },
        { title: "Plant 5 Tree", gift: "You will earn +50XP", isOk: false },
        {
          title: "Purchase 1 Tractor",
          gift: "You will earn +50XP",
          isOk: false,
        },
        {
          title: "Make All Land Fertile",
          gift: "You will earn +10XP",
          isOk: false,
        },

        {
          title: "Create Your First Fertile Land",
          gift: "You will earn +100XP",
          isOk: true,
        },
        {
          title: "Claim Your First Resource",
          gift: "ou will earn +1 Resource",
          isOk: true,
        },
        {
          title: "Purchase the Farm",
          gift: "ou will earn +1 Resource",
          isOk: true,
        },
      ].map((item, index) => (
        <li
          key={index}
          className={`flex items-center ${
            item.isOk && "line-through opacity-60"
          }`}
        >
          {item.title}
          <div className="group relative ">
            {item.isOk ? (
              <FaCheck
                className="ml-2 cursor-pointer outline-none"
                color="#42280f"
              />
            ) : (
              <>
                <FaGift
                  id={`tooltip-${index}`}
                  className="ml-2 cursor-pointer outline-none"
                  color="#42280f"
                />
                <Tooltip
                  className=" !rounded-xl"
                  anchorSelect={`#tooltip-${index}`}
                >
                  {item.gift}
                </Tooltip>
              </>
            )}
          </div>
        </li>
      ))}
    </ul> */}

    <ul className="text-sm ">
      <li className={`flex items-center`}>
        <TaskItem
          landId={landId}
          taskId={"DISCORD_FARMER_ROLE"}
          complateTitle={"Follow us on Twitter!"}
          rewardsTitle={"100XP"}
        >
          {() => <TwitterConnectButton landId={landId} />}
        </TaskItem>
      </li>

      <li className={`flex items-center`}>
        <TaskItem
          landId={landId}
          taskId={"DISCORD_FARMER_ROLE"}
          complateTitle={"Connect DC and claim roles!"}
          rewardsTitle={"500XP"}
        >
          {() => <DiscordFlow landId={landId} />}
        </TaskItem>
      </li>

      <li className={`flex items-center`}>
        <TaskItem
          landId={landId}
          taskId={"TELEGRAM_JOIN"}
          complateTitle={"Join our Telegram Group!"}
          rewardsTitle={"100XP"}
        >
          {(props) => <TelegramJoinGroupButton landId={landId} {...props} />}
          {/* <TelegramJoinGroupButton landId={landId}  /> */}
        </TaskItem>
      </li>

      <li className={`flex items-center`}>
        <TaskItem
          landId={landId}
          taskId={"CLAIM_GRASS_LAND_1"}
          complateTitle={"Claim 1 grass area succes!"}
          rewardsTitle={"100XP"}
        >
          {(props) => (
            <ClaimLandButton
              grassSize={1}
              taskId={"CLAIM_GRASS_LAND_1"}
              xpReward={100}
              landId={landId}
              {...props}
            />
          )}
        </TaskItem>
      </li>

      <li className={`flex items-center`}>
        <TaskItem
          landId={landId}
          taskId={"CLAIM_TREE_1"}
          complateTitle={"Stake 1 tree succes!"}
          rewardsTitle={"100XP"}
        >
          {(props) => (
            <ClaimTreeButton
              taskId={"CLAIM_TREE_1"}
              xpReward={100}
              landId={landId}
              {...props}
            />
          )}
        </TaskItem>
      </li>
    </ul>
    {/* <AuthButton />
    <RoleCheck /> */}
    {/* <DiscordFlow /> */}
    {/* <TaskManagement userId={"userId"} /> */}
  </div>
);

export default MissionsContent;
