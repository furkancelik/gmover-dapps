import { FaCheck, FaGift } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const MissionsContent = () => (
  <div className="mb-4 mx-auto">
    <h2 className="text-xl font-bold mt-2 mb-1 text-black">Daily Tasks</h2>
    <ul className="text-sm">
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
    </ul>
  </div>
);

export default MissionsContent;
