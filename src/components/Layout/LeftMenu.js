"use client";
import { useEthereum } from "@/context/EthereumContext";
import { motion } from "framer-motion";
import ClaimTimer from "../ClaimTimer";
import { RESOURCE_CLAIM_INTERVAL } from "@/constants/resource";

export default function LeftMenu({
  para,
  kaynak,
  openModalWithContent,
  setIsModalOpen,
  lastClaimTime,
  claimResource,
  claimLoading,
}) {
  const {
    userAddress,
    provider,
    signer,
    contract,
    connectWallet,
    balance,
    disconnectWallet,
  } = useEthereum();

  return (
    <motion.div
      className=" fixed top-4 left-2 text-white z-10 "
      initial={{ opacity: 0, x: -100 }} // Başlangıç durumu: Opaklık 0 ve yukarıda konumlanmış
      animate={{ opacity: 1, x: 0 }} // Hedef durum: Opaklık 1 ve y ekseninde normal konum
      transition={{ duration: 1 }}
    >
      <div className=" flex flex-col gap-2">
        {userAddress ? (
          <>
            <button
              onClick={() => {
                openModalWithContent(
                  "Wallet Settings",

                  <div className="mx-auto flex flex-col items-center">
                    <div className="py-4">
                      <div className="flex flex-col items-center">
                        <div className="mb-4 text-6xl">🤑</div>
                        <div className="text-lg font-semibold">{`${userAddress?.slice(
                          0,
                          7
                        )}....${userAddress?.slice(-5)}`}</div>
                        <span>{parseFloat(balance || 0).toFixed(2)} MOVE</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        disconnectWallet();
                        setIsModalOpen(false);
                      }}
                      className="flex  items-center justify-center px-7 py-2 bg-gradient-to-t from-red-700 to-red-400 hover:from-red-500 hover:to-red-800  border-b-[5px] border-red-900 rounded-2xl text-lg shadow shadow-black/60 text-white "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6 mr-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                        />
                      </svg>
                      Disconnect Connection
                    </button>
                  </div>
                );
              }}
            >
              <div className="relative flex items-center justify-center ">
                <img src="/item-show-bg.png" className="w-[160px]" />
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center w-full  ">
                  <span className="ml-1  flex text-black text-opacity-80 font-semibold  ">
                    {`${userAddress.slice(0, 5)}...${userAddress.slice(-5)}`}
                  </span>
                </div>
              </div>
            </button>

            {[
              { title: "GMOVE", count: para, image: "/movementoken.png" },
              {
                title: claimLoading ? "Loading..." : "Resources",
                count: claimLoading ? "" : kaynak,
                image: "/kaynak.png",
                timer:
                  lastClaimTime + RESOURCE_CLAIM_INTERVAL >
                  Math.floor(Date.now() / 1000),
              },
            ].map((item, index) => (
              <div key={index}>
                <div className="relative flex items-center justify-center ">
                  <img src="/item-show-bg.png" className="w-[160px]  " />
                  <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center w-full  ">
                    <img
                      alt={item.title}
                      src={item.image}
                      className="size-6 "
                    />
                    <span className="ml-1 text-sm flex text-black text-opacity-80 font-semibold  ">
                      {item.count} {item.title}
                    </span>
                  </div>
                </div>
                {item.timer && (
                  <div className="flex items-center justify-center relative">
                    <img
                      src="/item-show-bottom-bg.png"
                      className="w-[120px] -translate-y-1.5 "
                    />

                    <ClaimTimer
                      time={lastClaimTime}
                      claimComponent={() => {
                        return (
                          <button
                            onClick={() => claimResource()}
                            className="absolute w-full text-center text-sm top-1/2 -translate-y-1/2 text-black text-opacity-80  "
                          >
                            Claim
                          </button>
                        );
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <button onClick={() => connectWallet()}>
            <div className="relative flex items-center justify-center ">
              <img src="/item-show-bg.png" className="w-[180px]  " />
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center w-full  ">
                <img
                  // alt={item.title}
                  src={"/1683021055metamask-icon.png"}
                  className="size-6 "
                />
                <span className="ml-1  flex text-black text-opacity-80 font-semibold  ">
                  Connect Wallet
                </span>
              </div>
            </div>
          </button>
        )}
      </div>
    </motion.div>
  );
}
