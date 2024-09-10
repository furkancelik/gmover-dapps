"use client";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { PiFarm, PiLock } from "react-icons/pi";
import { FaCheck, FaGift, FaLock } from "react-icons/fa6";
import { FiX } from "react-icons/fi";
import HomeContent from "../Page/HomeContent";
import MissionsContent from "../Page/MissionsContent";
import ResourceContent from "../Page/ResourceContent";
import MarketContent from "../Page/MarketContent";

export default function RightMenu({
  updateGmoveBalance,
  setShowSideMenu,
  showSideMenu,
  selectedContent,
  setSelectedContent,
  //
  inventory,
  setInventory,
  setIsModalOpen,
  openModalWithContent,
  handlePurchase,
  selectedItem,
  setSelectedItem,
  //
  claimResource,
  setKaynak,
  //
  kaynak,
  para,
}) {
  const sideMenuRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (event.target.classList.contains("no-sidemenu-show")) {
      return;
    }

    if (sideMenuRef.current && !sideMenuRef.current.contains(event.target)) {
      setShowSideMenu(false);
    }
  };

  const renderSelectedTitle = () => {
    switch (selectedContent) {
      case "market":
        return "Market";
      case "resource":
        return "Resources";
      case "missions":
        return "Tasks";
      default:
        return "Gmover Farm";
    }
  };

  const renderSelectedContent = () => {
    switch (selectedContent) {
      case "market":
        return (
          <MarketContent
            updateGmoveBalance={updateGmoveBalance}
            inventory={inventory}
            setInventory={setInventory}
            setIsModalOpen={setIsModalOpen}
            openModalWithContent={openModalWithContent}
            handlePurchase={handlePurchase}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        );
      case "resource":
        return (
          <ResourceContent
            claimResource={claimResource}
            setKaynak={setKaynak}
            openModalWithContent={openModalWithContent}
            setIsModalOpen={setIsModalOpen}
          />
        );
      case "missions":
        return (
          <MissionsContent
            openModalWithContent={openModalWithContent}
            setIsModalOpen={setIsModalOpen}
          />
        );
      default:
        return (
          <HomeContent
            setInventory={setInventory}
            kaynak={kaynak}
            para={para}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            setSelectedContent={setSelectedContent}
            inventory={inventory}
            openModalWithContent={openModalWithContent}
            setIsModalOpen={setIsModalOpen}
          />
        );
    }
  };

  return (
    <div
      ref={sideMenuRef}
      className={`${
        showSideMenu ? "!translate-x-0 !absolute" : "hover:translate-x-full"
      } fixed hover:absolute top-0 right-0 group translate-x-full h-screen w-4/5  sm:w-1/4   flex  flex-col justify-start items-center transition-all duration-300`}
    >
      <img
        src="/sidemenu-title.png"
        className=" w-[250px]   "
        initial={{ opacity: 0, y: -100 }} // Başlangıç durumu: Opaklık 0 ve yukarıda konumlanmış
        animate={{ opacity: 1, y: 0 }} // Hedef durum: Opaklık 1 ve y ekseninde normal konum
        transition={{ duration: 1 }} // Geçiş süresi 1 saniye
      />

      <div className="flex flex-col items-center  pb-5 z-10">
        <div className="w-full relative">
          <img src="/board-header.png" alt="Header" className="w-full h-auto" />
          <h1 className="absolute top-3 text-xl font-bold w-full text-center ">
            {renderSelectedTitle()}
          </h1>

          <ul className=" absolute top-4 left-0 -translate-x-[70px] translate-y-14 -z-[1] -rotate-1  ">
            <li
              onClick={() => {
                setShowSideMenu(!showSideMenu);
              }}
              className="relative "
              style={{ zIndex: 1 }}
            >
              <img
                src={
                  showSideMenu
                    ? "menu-button-cros.png"
                    : "menu-button-mobile.png"
                }
                className=" h-16"
              />
            </li>
            {[
              {
                icon: PiFarm,
                title: "Market",
                image: "menu-button-home.png",
                link: "home",
              },
              {
                icon: PiFarm,
                title: "Market",
                image: "menu-button-market.png",
                link: "market",
              },
              {
                icon: PiFarm,
                title: "Kaynak",
                image: "menu-button-resources.png",
                link: "resource",
              },
              {
                icon: PiFarm,
                title: "Görevler",
                image: "menu-button-tasks.png",
                link: "missions",
              },
            ].map((v, i) => (
              <li
                onClick={() => {
                  setSelectedContent(v.link);
                  setShowSideMenu(true);
                }}
                key={i}
                className={`relative  -mt-1 `}
                style={{ zIndex: i * -1 }}
              >
                <img src={v.image} className={`h-16`} />
                <p className="absolute top-0 left-0 pt-4 pl-[86px] text-2xl  text-black">
                  {v.title}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full min-h-[400px]     bg-[url('/board-content.png')] bg-repeat-y bg-contain">
          <div className="  flex px-7 -mt-2">{renderSelectedContent()}</div>
        </div>

        <div className="w-full relative">
          <img src="/board-footer.png" alt="Footer" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
}
