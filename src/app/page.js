"use client";
import {
  Stage,
  Container,
  Sprite,
  AnimatedSprite,
  Graphics,
} from "@pixi/react";
import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { PiFarm, PiLock } from "react-icons/pi";
import { FaCheck, FaGift, FaLock } from "react-icons/fa6";
import { FiX } from "react-icons/fi";
import "react-tooltip/dist/react-tooltip.css";
import { motion } from "framer-motion";

import { Tooltip } from "react-tooltip";

import { GlowFilter } from "@pixi/filter-glow";

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id === "modal-background") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-background"
      className="absolute left-0 top-0 right-0 bottom-0 bg-black bg-opacity-70 flex items-center justify-center z-50 "
    >
      <div className=" relative  mx-auto flex flex-col items-center max-w-md ">
        <div className="w-full relative">
          <img src="/board-header.png" alt="Header" className="w-full h-auto" />
          <h1 className="absolute top-5 text-xl font-bold w-full text-center ">
            {title}
          </h1>
          <button
            className=" absolute size-10 flex items-center justify-center top-0 right-0 bg-red-600 text-white rounded-full -translate-x-1/2 mr-2 -translate-y-1/2 mt-3"
            onClick={onClose}
          >
            <FiX className=" size-6" />
          </button>
        </div>

        <div className="w-full min-h-[300px] bg-[url('/board-content.png')] bg-repeat-y bg-contain">
          <div className="flex px-8">{children}</div>
        </div>

        <div className="w-full relative">
          <img src="/board-footer.png" alt="Footer" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

// GridTile Bileşeni
const GridTile = ({
  x,
  y,
  texture,
  interactive,
  onPointerOver,
  onPointerOut,
  onClick,
  tint,
}) => {
  const tileWidth = 128;
  const tileHeight = 64;

  // İzometrik hit area tanımlama
  const hitArea = new PIXI.Polygon([
    new PIXI.Point(tileWidth / 2, 0), // Üst köşe
    new PIXI.Point(tileWidth, tileHeight / 2), // Sağ köşe
    new PIXI.Point(tileWidth / 2, tileHeight), // Alt köşe
    new PIXI.Point(0, tileHeight / 2), // Sol köşe
  ]);

  return (
    <Sprite
      texture={texture}
      x={x}
      y={y}
      tint={tint}
      width={tileWidth}
      height={tileHeight}
      interactive={interactive}
      hitArea={hitArea}
      pointerover={onPointerOver}
      pointerout={onPointerOut}
      pointertap={onClick}
    />
  );
};

// InteractiveSprite Bileşeni
const InteractiveSprite = ({
  texture,
  x,
  y,
  width,
  height,
  tintOver,
  onClick,
  ...props
}) => (
  <Sprite
    texture={texture}
    x={x}
    y={y}
    width={width}
    height={height}
    interactive={true}
    pointerover={(e) => {
      e.currentTarget.tint = tintOver;
    }}
    click={onClick}
    pointerout={(e) => {
      e.currentTarget.tint = 0xffffff;
    }}
    {...props}
  />
);

const InventoryItem = ({
  item,
  selectedItem,
  setSelectedItem,
  onClick = () => {
    setSelectedItem((prevItem) => (item === prevItem ? false : item));
  },
}) => {
  return (
    <div className="text-sm text-center font-semibold">
      <div
        onClick={onClick}
        className={`bg-[#cdaa6d] p-2 rounded-lg flex items-center justify-center shadow-inner shadow-black/40 relative ${
          item.isLock && "opacity-80"
        } hover:bg-[#8adc53] transition-all duration-300 cursor-pointer ${
          selectedItem?.title === item.title && "!bg-[#5ea531]"
        }`}
      >
        {item.count > 1 && (
          <div className="absolute size-6 font-semibold flex items-center justify-center text-xs rounded-full top-0 right-0 translate-x-1/2 -translate-y-1/2 mr-1 mt-1 bg-red-600 text-white">
            {item.count}
          </div>
        )}
        {item.isLock && (
          <FaLock color="#4f3c1c" className="size-8 absolute z-[1]" />
        )}
        <div>
          <img
            src={item.image}
            alt={item.title}
            className={`size-11 ${item.isLock && "opacity-50 grayscale"}`}
          />
        </div>
      </div>
      {item.title}
    </div>
  );
};

const HomeContent = ({
  inventory,
  setSelectedContent,
  selectedItem,
  setSelectedItem,
  kaynak,
  para,
}) => {
  return (
    <div className="mb-4 mx-auto">
      <h2 className="text-xl font-bold mt-2 mb-1 text-black">
        About Your Farm
      </h2>
      <ul className="mb-4">
        <li className="flex flex-row">
          <div className="">Total Resources:</div>
          <span className="ml-1 font-bold text-center">{kaynak}</span>
        </li>
        <li className="flex flex-row">
          <div className="">Total GMOVE:</div>
          <span className="ml-1 font-bold text-center">{para}</span>
        </li>
        <li className="flex flex-row">
          <div className="">Average Farm Earnings:</div>
          <span className="ml-1 font-bold text-center">N/A</span>
        </li>
      </ul>

      <h2 className="text-xl font-bold mt-2 mb-2 text-black">
        Available Items
      </h2>
      <div
        className={`${
          inventory.length > 0 ? "grid  gap-3 grid-cols-4 mx-2" : ""
        }  `}
      >
        {inventory?.map((item, index) => (
          <InventoryItem
            key={index}
            item={item}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        ))}

        {inventory.length > 0 ? (
          12 - inventory.length > 0 &&
          Array(12 - inventory.length)
            .fill(null)
            .map((item, index) => (
              <div className="text-sm text-center font-semibold">
                <div
                  key={index}
                  className={`bg-[#cdaa6d]  p-2 rounded-lg flex items-center justify-center shadow-inner shadow-black/40  relative `}
                >
                  <div className="size-11 "></div>
                </div>
              </div>
            ))
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="mb-4">
              No available items. Please visit the market to purchase items.
            </p>
            <button
              onClick={() => {
                setSelectedContent("market");
              }}
              className="px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
            >
              Go to Market
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MarketContent = ({
  inventory,
  openModalWithContent,
  handlePurchase,
  setIsModalOpen,
  selectedItem,
  setSelectedItem,
}) => {
  return (
    <div className="mb-4 mx-auto">
      <h2 className="text-xl font-bold mt-2 mb-2 text-black">
        Items You Can Purchase
      </h2>
      <div className="grid  gap-3 grid-cols-4 mx-2  ">
        {[
          { title: "tree", image: "/agac.png", price: 50, isLock: false },
          {
            title: "tractor",
            image: "/tractor.png",
            price: 250,
            isLock: false,
          },
          { title: "tree", image: "/agac.png", isLock: true, price: 100 },
          { title: "tractor", image: "/tractor.png", isLock: true, price: 150 },
          { title: "tree", image: "/agac.png", isLock: true, price: 200 },
          { title: "tractor", image: "/tractor.png", isLock: true, price: 300 },
          { title: "tree", image: "/agac.png", isLock: true, price: 400 },
          { title: "tractor", image: "/tractor.png", isLock: true, price: 450 },
          { title: "tree", image: "/agac.png", isLock: true, price: 500 },
          { title: "tractor", image: "/tractor.png", isLock: true, price: 500 },
        ].map((item, index) => (
          <button
            disabled={item.isLock}
            onClick={() => {
              openModalWithContent(
                "Tree NFT Buy",
                <div className="mx-auto">
                  <div
                    className={`bg-[#cdaa6d]  p-2 rounded-lg flex items-center justify-center shadow-inner shadow-black/40`}
                  >
                    <div>
                      <img
                        src={item.image}
                        alt={item.title}
                        className={` w-3/4 py-4 mx-auto`}
                      />
                    </div>
                  </div>
                  <div className="text-center flex flex-col items-center justify-center mb-2">
                    <h3 className=" font-semibold text-lg mt-2">
                      {item.title}
                    </h3>
                    <p className="my-2 text-sm font-semibold">
                      {item.price} GMOVE
                    </p>
                    <button
                      onClick={() => {
                        handlePurchase(item);
                        setIsModalOpen(false);
                      }}
                      className="px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
                    >
                      Buy
                    </button>
                    {/* <button className="relative bg-[url('/button.png')] bg-cover bg-center bg-no-repeat min-w-[160px] h-[60px] flex items-center justify-center text-lg font-semibold text-[#422716] px-4 py-2">
                      Satın Al
                    </button> */}
                  </div>
                </div>
              );
            }}
            key={index}
            className={`bg-[#cdaa6d]  p-2 rounded-lg flex items-center justify-center shadow-inner shadow-black/40  ${
              item.isLock && "opacity-80"
            } hover:bg-[#8adc53] transition-all duration-300 cursor-pointer`}
          >
            {item.isLock && (
              <FaLock color="#4f3c1c" className="size-8 absolute z-[1] " />
            )}
            <div>
              <img
                src={item.image}
                alt={item.title}
                className={`size-11 ${item.isLock && "opacity-50 grayscale"}`}
              />
            </div>
          </button>
        ))}
      </div>
      <h2 className="text-xl font-bold mt-2 mb-2 text-black">
        Items You’ve Purchased
      </h2>
      <div className="grid  gap-3 grid-cols-4 mx-2  ">
        {inventory?.map((item, index) => (
          <InventoryItem
            key={index}
            item={item}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        ))}
      </div>
    </div>
  );
};

const ResourceContent = ({ setKaynak }) => (
  <div className="mb-4 mx-auto mt-4">
    {/* <h2 className="text-xl font-bold mt-2 mb-2 text-black">
      Satın Alabileceğiniz
    </h2> */}
    <div className=" text-center">
      <img src="/kaynak2.png" className=" w-1/2 mx-auto h-auto" />
      <p className="text-sm p-2 text-justify mb-4">
        Resources are vital for developing your farm. You can turn barren land
        into fertile land with the resources you collect. Plant the items you’ve
        purchased on these fertile lands to increase your daily earnings. You
        can collect 1 resource every day.
      </p>
      <button
        onClick={() => setKaynak((kaynak) => kaynak + 1)}
        className="px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
      >
        Claim +1 Resource
      </button>
    </div>
  </div>
);

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

const GameScene = () => {
  const [showSideMenu, setShowSideMenu] = useState(false);
  const sideMenuRef = useRef(null);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 800,
    height: typeof window !== "undefined" ? window.innerHeight : 600,
  });

  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

  const [scaleFactor, setScaleFactor] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const [selectedContent, setSelectedContent] = useState("home");

  const [fenceLeftTexture, setFenceLeftTexture] = useState(null);
  const [fenceRightTexture, setFenceRightTexture] = useState(null);

  const [tractorFrames, setTractorFrames] = useState([]);

  const [windmillFrames, setWindmillFrames] = useState([]);
  const [treeFrames, setTreeFrames] = useState([]);
  const [woodFrames, setWoodFrames] = useState([]); // Kaynak animasyon frame'leri için state

  const [selectedInfo, setSelectedInfo] = useState(null); // Seçili öğe bilgisi
  const [selectedItem, setSelectedItem] = useState(null);
  const [kaynak, setKaynak] = useState(0);
  const [para, setPara] = useState(1000); // Para state'i
  const [inventory, setInventory] = useState([]); // Alınan öğeleri izlemek için inventory
  // const [inventory, setInventory] = useState({ tree: 0, tractor: 0 }); // Alınan öğeleri izlemek için inventory
  const [dryTexture, setDryTexture] = useState(null);
  const [grassTexture, setGrassTexture] = useState(null);
  const [houseTexture, setHouseTexture] = useState(null);
  const [woodTexture, setWoodTexture] = useState(null);
  const [treeTexture, setTreeTexture] = useState(null);
  const [windmillTexture, setWindmillTexture] = useState(null);
  const [tractorTexture, setTractorTexture] = useState(null);

  const tileWidth = 128;
  const tileHeight = 64;
  const houseWidth = tileWidth * 1.5;
  const houseHeight = 130;
  const gridSize = 7;

  const [gridState, setGridState] = useState(
    Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill("dry"))
  );

  const handleClickOutside = (event) => {
    if (sideMenuRef.current && !sideMenuRef.current.contains(event.target)) {
      setShowSideMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const newWindowSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      setWindowSize(newWindowSize);

      const newScaleFactor = Math.min(
        newWindowSize.width / 800,
        newWindowSize.height / 600
      );
      setScaleFactor(newScaleFactor);

      // Stage'i ortalamak için pozisyonu hesapla
      setStagePosition({
        x: newWindowSize.width / 2 - (800 * newScaleFactor) / 2,
        y: newWindowSize.height / 2 - (600 * newScaleFactor) / 2,
      });
    };

    window.addEventListener("resize", handleResize);

    // Initial scale factor and stage position calculation
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const tractorTextures = [
      //   PIXI.Texture.from("/tractor/tractor0.png"),
      PIXI.Texture.from("/tractor/tractor1.png"),
      PIXI.Texture.from("/tractor/tractor2.png"),
      PIXI.Texture.from("/tractor/tractor3.png"),
      PIXI.Texture.from("/tractor/tractor4.png"),
      PIXI.Texture.from("/tractor/tractor5.png"),
      PIXI.Texture.from("/tractor/tractor6.png"),
      PIXI.Texture.from("/tractor/tractor3.png"),
      PIXI.Texture.from("/tractor/tractor1.png"),
      // Daha fazla kare ekleyebilirsiniz
    ];
    setTractorFrames(tractorTextures);

    const windmillTextures = [
      PIXI.Texture.from("/degirmen/degirmen0.png"),
      PIXI.Texture.from("/degirmen/degirmen1.png"),
      PIXI.Texture.from("/degirmen/degirmen2.png"),
    ];
    setWindmillFrames(windmillTextures);

    // Ağaç için animasyon frame'lerini yükleyin
    const treeTextures = [
      PIXI.Texture.from("/agac/agac0.png"),
      PIXI.Texture.from("/agac/agac2.png"),
      PIXI.Texture.from("/agac/agac3.png"),
      PIXI.Texture.from("/agac/agac3-1.png"),
      PIXI.Texture.from("/agac/agac3-2.png"),
      PIXI.Texture.from("/agac/agac3-3.png"),
      PIXI.Texture.from("/agac/agac4.png"),
      PIXI.Texture.from("/agac/agac4-1.png"),
      PIXI.Texture.from("/agac/agac4-2.png"),
      PIXI.Texture.from("/agac/agac4-3.png"),
      PIXI.Texture.from("/agac/agac5.png"),
      PIXI.Texture.from("/agac/agac6.png"),
      PIXI.Texture.from("/agac/agac7.png"),
    ];
    setTreeFrames(treeTextures);

    // Kaynak için animasyon frame'lerini yükleyin
    const woodTextures = [
      PIXI.Texture.from("/kaynak/kaynak0.png"),
      PIXI.Texture.from("/kaynak/kaynak1.png"),
    ];
    setWoodFrames(woodTextures);

    const dry = PIXI.Texture.from("/a.png");
    setDryTexture(dry);

    const house = PIXI.Texture.from("/ev.png");
    setHouseTexture(house);

    const leftFence = PIXI.Texture.from("/cift_sola.png"); // Sola bakan çit görselinin yolu
    const rightFence = PIXI.Texture.from("/cift_saga.png"); // Sağa bakan çit görselinin yolu
    setFenceLeftTexture(leftFence);
    setFenceRightTexture(rightFence);

    // const wood = PIXI.Texture.from("/kaynak2.png");
    // setWoodTexture(wood);

    // const tree = PIXI.Texture.from("/agac.png");
    // setTreeTexture(tree);

    const grass = PIXI.Texture.from("/b.png");
    setGrassTexture(grass);

    // const windmill = PIXI.Texture.from("/degirmen.png");
    // setWindmillTexture(windmill);

    // const tractor = PIXI.Texture.from("/tractor.png");
    // setTractorTexture(tractor);
  }, []);

  const renderSelectedContent = () => {
    switch (selectedContent) {
      case "market":
        return (
          <MarketContent
            inventory={inventory}
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

  const handleTileClick = (row, col) => {
    console.log("kaynak:", kaynak);
    if (gridState[row][col] === "dry") {
      if (kaynak > 0) {
        setKaynak(kaynak - 1);
        const newGridState = [...gridState];
        newGridState[row][col] = "grass";
        setGridState(newGridState);
      } else {
        // alert("Insufficient resources! You need to collect more resources.");
        openModalWithContent(
          "Kurak Arazi",

          <div className="mx-auto flex flex-col items-center">
            <div
              className={`bg-[#cdaa6d]     p-2 rounded-lg flex items-center  justify-center shadow-inner shadow-black/40`}
            >
              <div>
                <img
                  src={"/a.png"}
                  alt={"Kurak Arazi"}
                  className={` w-3/4 py-4 mx-auto`}
                />
              </div>
            </div>
            <div className="text-center flex flex-col items-center justify-center mb-2">
              <h3 className=" font-semibold text-lg mt-2">Kurak Arazi</h3>
              <p className="my-1 text-sm font-semibold">
                Bu alanı 1 kaynak karşılığında ekilebilir araziye
                çevirebilirsiniz ve bu sayede alana birşeyler ekerek kazanmaya
                başlayabilirsin.
              </p>

              <button
                onClick={() => {
                  setKaynak((kaynak) => kaynak + 1);
                  setIsModalOpen(false);
                }}
                className="mt-4 px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
              >
                Claim +1 Resource
              </button>
            </div>
          </div>
        );
      }
    } else if (gridState[row][col] === "grass") {
      if (selectedItem) {
        // inventory içindeki seçili itemi bul
        const itemIndex = inventory.findIndex(
          (invItem) => invItem.title === selectedItem.title
        );

        if (itemIndex !== -1 && inventory[itemIndex].count > 0) {
          // Onay penceresi
          const confirmPlacement = window.confirm(
            `Are you sure you want to place the ${selectedItem.title} in this area?`
          );

          if (confirmPlacement) {
            const newGridState = [...gridState];
            newGridState[row][col] = selectedItem.title; // Eşleşen itemin başlığını kullan
            setGridState(newGridState);

            setInventory((prevInventory) => {
              const updatedInventory = [...prevInventory];
              updatedInventory[itemIndex].count -= 1;

              // Eğer count 0 olursa, itemi kaldır
              if (updatedInventory[itemIndex].count === 0) {
                updatedInventory.splice(itemIndex, 1);
              }

              return updatedInventory;
            });

            setSelectedItem(null);
          } // else durumunda bir işlem yapmıyoruz, kullanıcı Hayır dediyse hiçbir işlem yapılmıyor
        } else {
          alert("The item you selected is not in your inventory!");
        }
      } else {
        // alert(
        //   "Please select an item to plant! You can choose an item you’ve purchased from the Available Items."
        // );
        openModalWithContent(
          "Ekilebilir Arazi",
          <div className="mx-auto flex flex-col items-center">
            <div
              className={`bg-[#cdaa6d]     p-2 rounded-lg flex items-center  justify-center shadow-inner shadow-black/40`}
            >
              <div>
                <img
                  src={"/b.png"}
                  alt={"Ekilebilir Arazi"}
                  className={` w-3/4 py-4 mx-auto`}
                />
              </div>
            </div>
            <div className="text-center flex flex-col items-center justify-center mb-2">
              <h3 className=" font-semibold text-lg mt-2">Ekilebilir Arazi</h3>
              <p className="my-1 text-sm font-semibold">
                Bu alanı daha önce satın aldığınız itemleri ekleyebilirsiniz ve
                bu sayede kazanç elde etmeye başlayabilirsiniz.
              </p>

              <div
                className={`${
                  inventory.length > 0
                    ? "grid  gap-3 grid-cols-4 mx-2 mt-5"
                    : ""
                }  `}
              >
                {inventory.length > 0 ? (
                  inventory?.map((item, index) => (
                    <InventoryItem
                      key={index}
                      item={item}
                      selectedItem={selectedItem}
                      setSelectedItem={setSelectedItem}
                      onClick={() => {
                        const itemIndex = inventory.findIndex(
                          (invItem) => invItem.title === item.title
                        );

                        if (
                          itemIndex !== -1 &&
                          inventory[itemIndex].count > 0
                        ) {
                          // Onay penceresi
                          const confirmPlacement = window.confirm(
                            `Are you sure you want to place the ${item.title} in this area?`
                          );

                          if (confirmPlacement) {
                            const newGridState = [...gridState];
                            newGridState[row][col] = item.title; // Eşleşen itemin başlığını kullan
                            setGridState(newGridState);

                            setInventory((prevInventory) => {
                              const updatedInventory = [...prevInventory];
                              updatedInventory[itemIndex].count -= 1;

                              // Eğer count 0 olursa, itemi kaldır
                              if (updatedInventory[itemIndex].count === 0) {
                                updatedInventory.splice(itemIndex, 1);
                              }

                              return updatedInventory;
                            });

                            setSelectedItem(null);
                            setIsModalOpen(false);
                          } // else durumunda bir işlem yapmıyoruz, kullanıcı Hayır dediyse hiçbir işlem yapılmıyor
                        } else {
                          alert(
                            "The item you selected is not in your inventory!"
                          );
                        }
                      }}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <button
                      onClick={() => {
                        setShowSideMenu(true);
                        setIsModalOpen(false);
                        setSelectedContent("market");
                      }}
                      className="px-7 py-2 bg-gradient-to-t from-[#48b407] to-[#97e70c] hover:from-[#a1f411] hover:to-[#3f9c07]  border-b-[5px] border-[#208200] rounded-2xl text-lg shadow shadow-black/60 text-white "
                    >
                      Go to Market
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }
    }
  };

  const handleItemClick = (itemType, row, col) => {
    // setSelectedInfo({ itemType, row, col });
    openModalWithContent(
      itemType,
      <div className="mx-auto">
        <div
          className={`bg-[#cdaa6d]  p-2 rounded-lg flex items-center justify-center shadow-inner shadow-black/40`}
        >
          <div>
            <img
              src={itemType === "tree" ? "/agac.png" : "tractor.png"}
              alt={itemType}
              className={` w-3/4 py-4 mx-auto`}
            />
          </div>
        </div>
        <div className="text-center flex flex-col items-center justify-center mb-2">
          <h3 className=" font-semibold text-lg mt-2">{itemType}</h3>
          <p className="my-2 text-sm font-semibold">APY: NA</p>
          <button
            onClick={() => {
              handleRemoveItem({ itemType, row, col });
            }}
            className="px-7 py-2 bg-gradient-to-t from-red-700 to-red-400 hover:from-red-500 hover:to-red-800  border-b-[5px] border-red-900 rounded-2xl text-lg shadow shadow-black/60 text-white "
          >
            Burn
          </button>
        </div>
      </div>
    );
  };

  const handleRemoveItem = ({ itemType, row, col }) => {
    // if (selectedInfo) {
    const isConfirmed = window.confirm(
      "Are you sure you want to burn (remove) the item?"
    );
    if (isConfirmed) {
      // const { row, col } = selectedInfo;
      const newGridState = [...gridState];
      newGridState[row][col] = "grass"; // Öğeyi kaldır ve tekrar grass yap
      setGridState(newGridState);
      // setSelectedInfo(null);
      setIsModalOpen(false);
    }
    // }
  };

  // const handlePurchase = (item) => {
  //   const cost = item.price;
  //   if (para >= cost) {
  //     setPara(para - cost);
  //     setInventory((prevInventory) => [...prevInventory, item]);
  //   } else {
  //     alert("Yetersiz para! Bu öğeyi satın alamazsınız.");
  //   }
  // };
  const handlePurchase = (item) => {
    const cost = item.price;
    if (para >= cost) {
      setInventory((prevInventory) => {
        console.log(prevInventory);
        const existingItemIndex = prevInventory.findIndex(
          (invItem) => invItem.title === item.title
        );

        console.log("existingItemIndex:", existingItemIndex);
        if (existingItemIndex !== -1) {
          // Eğer aynı başlığa sahip bir öğe zaten varsa, count değerini artır.
          const updatedInventory = [...prevInventory];
          updatedInventory[existingItemIndex].count += 1;
          return updatedInventory;
        } else {
          // Eğer aynı başlığa sahip bir öğe yoksa, yeni öğeyi ekle.
          return [...prevInventory, { ...item, count: 1 }];
        }
      });
      setPara(para - cost);
    } else {
      alert("Insufficient GMOVE! You cannot purchase this item.");
    }
  };

  const renderGrid = () => {
    const tiles = [];
    const zeminIzgara = [];
    const sabitObjeler = [];
    const dinamikObjeler = [];

    const fenceLeftPositions = [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
    ];

    const fenceRightPositions = [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
    ];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const { posX, posY } = calculateTilePosition(row, col);
        const texture = getTileTexture(row, col);
        const interactive = isTileInteractive(row, col);

        zeminIzgara.push(
          <GridTile
            key={`${row}-${col}`}
            x={posX}
            y={posY}
            texture={texture}
            interactive={interactive}
            tint={0xffffff}
            onPointerOver={(e) =>
              interactive && (e.currentTarget.tint = 0xaaaaff)
            }
            onPointerOut={(e) =>
              interactive && (e.currentTarget.tint = 0xffffff)
            }
            onClick={() => handleTileClick(row, col)}
          />
        );

        if (
          fenceLeftPositions.some(
            ([fenceRow, fenceCol]) => fenceRow === row && fenceCol === col
          )
        ) {
          sabitObjeler.push(
            <Sprite
              key={`fence-left-${row}-${col}`}
              texture={fenceLeftTexture}
              x={posX - 6}
              y={posY - tileHeight / 2 - 10} // Çiti uygun şekilde hizalayın
              width={tileWidth / 2 + 6}
              height={tileHeight + 10}
              interactive={false} // Çitler statik, interaktif değil
            />
          );
        }

        if (
          fenceRightPositions.some(
            ([fenceRow, fenceCol]) => fenceRow === row && fenceCol === col
          )
        ) {
          sabitObjeler.push(
            <Sprite
              key={`fence-right-${row}-${col}`}
              texture={fenceRightTexture}
              x={posX + tileWidth / 2}
              y={posY - tileHeight / 2 - 10} // Çiti uygun şekilde hizalayın
              width={tileWidth / 2 + 6}
              height={tileHeight + 10}
              interactive={false} // Çitler statik, interaktif değil
            />
          );
        }

        if (
          gridState[row][col] === "tractor" ||
          gridState[row][col] === "tree"
        ) {
          dinamikObjeler.push(
            renderDynamicObject(row, col, posX, posY, gridState[row][col])
          );
        }
      }
    }

    sabitObjeler.push(renderHouse());
    sabitObjeler.push(renderWood());
    sabitObjeler.push(renderWindmill());

    return [...zeminIzgara, ...sabitObjeler, ...dinamikObjeler];
  };

  const calculateTilePosition = (row, col) => {
    const x = (col - row) * (tileWidth / 2);
    const y = (col + row) * (tileHeight / 2.1);

    // window nesnesine yalnızca tarayıcıda erişin
    if (typeof window !== "undefined") {
      const sideMenuWidth = 0; // %25 oranını burada hesaplıyoruz
      // const xOffset = window.innerWidth / 2 - tileWidth / 2;
      // const yOffset =
      //   (window.innerHeight - tileHeight * gridSize) / 2 + tileHeight * 2;
      const scaleFactor = Math.min(
        window.innerWidth / 800,
        window.innerHeight / 600
      );
      const scaledTileWidth = tileWidth;
      const scaledTileHeight = tileHeight * scaleFactor;

      const xOffset = 0;

      const yOffset = 0; // (window.innerHeight - scaledTileHeight * gridSize) / 2;

      return { posX: x + xOffset - sideMenuWidth / 2, posY: y + yOffset };
    }

    // Varsayılan değerler döndür (sunucu tarafında)
    return { posX: x, posY: y };
  };

  const getTileTexture = (row, col) => {
    const isUnderObject = isTileUnderObject(row, col);
    return isUnderObject
      ? grassTexture
      : gridState[row][col] === "dry"
      ? dryTexture
      : grassTexture;
  };

  const isTileInteractive = (row, col) => {
    return !isTileUnderObject(row, col);
  };

  const isTileUnderObject = (row, col) => {
    return (
      (row === 0 && col === 0) ||
      (row === 0 && col === 1) ||
      (row === 1 && col === 0) ||
      (row === 1 && col === 1) ||
      (row === 0 && col === 2) ||
      (row === 0 && col === 3) ||
      gridState[row][col] === "tractor" ||
      gridState[row][col] === "tree"
    );
  };

  const renderHouse = () => {
    const { posX, posY } = calculateTilePosition(0, 0);
    return (
      <InteractiveSprite
        key="house"
        texture={houseTexture}
        x={posX - tileWidth / 3.7}
        y={posY - houseHeight + tileHeight + tileHeight / 2 + tileHeight / 5}
        width={houseWidth}
        height={houseHeight}
        tintOver={0xffa500}
        interactive={true}
        pointertap={() => {
          setSelectedContent("home");
          setShowSideMenu(true);
        }}
      />
    );
  };

  const renderWood = () => {
    const { posX, posY } = calculateTilePosition(0, 2);
    return (
      <AnimatedSprite
        key="wood"
        textures={woodFrames}
        x={posX + ((tileWidth / 3) * 1.4) / 2}
        y={posY}
        width={(tileWidth / 3) * 1.4}
        height={(tileHeight / 2) * 1.5}
        animationSpeed={0.1} // Animasyon hızını ayarlayın
        loop={true} // Döngü sürekli olsun
        initialFrame={0} // Başlangıç frame'i
        isPlaying={true} // Animasyon oynasın
        pointerover={(e) => (e.currentTarget.tint = 0xff0000)} // Üzerine gelindiğinde rengi değiştir
        pointerout={(e) => (e.currentTarget.tint = 0xffffff)} // Çıkıldığında eski rengine dön
        pointertap={() => {
          setKaynak(kaynak + 1);
          setSelectedContent("resource");
          setShowSideMenu(true);
        }}
        interactive={true}
      />
    );
  };

  const renderWindmill = () => {
    const { posX, posY } = calculateTilePosition(0, 3);
    return (
      <AnimatedSprite
        key="windmill"
        textures={windmillFrames}
        x={posX + tileWidth / 2 - 40}
        y={posY - tileWidth / 2 + 15}
        width={tileWidth / 1.8}
        height={tileHeight * 1.4}
        animationSpeed={0.1} // Animasyon hızını ayarlayın
        loop={true} // Döngü sürekli olsun
        initialFrame={0} // Başlangıç frame'i
        isPlaying={true} // Animasyon oynasın
        tintOver={0xffa500}
        interactive={true}
        pointerover={(e) => (e.currentTarget.tint = 0xff0000)} // Üzerine gelindiğinde rengi değiştir
        pointerout={(e) => (e.currentTarget.tint = 0xffffff)} // Çıkıldığında eski rengine dön
        pointertap={() => {
          setSelectedContent("missions");
          setShowSideMenu(true);
        }}
      />
    );
  };

  // Güneş resmi için bir sprite oluşturuyoruz
  const Sun = () => {
    if (typeof window === "undefined") return null;
    const drawSun = (g) => {
      g.clear();

      // Outer glow
      g.beginFill(0xffff00, 0.5); // Sarı renkte yarı şeffaf bir ışık halesi
      g.drawCircle(0, 0, 70); // Hale için daha büyük bir çember
      g.endFill();

      // Inner sun
      g.beginFill(0xffd700); // Parlak sarı renk
      g.drawCircle(0, 0, 40); // Güneş için daha küçük bir çember
      g.endFill();
    };

    return (
      <Graphics
        draw={drawSun}
        // x={window.innerWidth - window.innerWidth * 0.25 - 80}
        x={windowSize.width / 3 - (tileWidth * scaleFactor) / 2}
        y={(windowSize.height / 2 - tileHeight * 2.2 * scaleFactor - 40) * -1}
        // y={-20}
        filters={[
          new GlowFilter({
            distance: 30, // Daha düşük bir mesafe seçildi
            outerStrength: 3, // Hafifçe artırılmış dış parlaklık
            innerStrength: 1, // İç parlaklık
            color: 0xffff00,
          }),
        ]} // Glow efekti
      />
    );
  };

  const renderDynamicObject = (row, col, posX, posY, itemType) => {
    let frames;
    let xOffset, yOffset, spriteWidth, spriteHeight;

    if (itemType === "tractor" && tractorFrames.length > 0) {
      frames = tractorFrames;
      xOffset = 34;
      yOffset = -12;
      spriteWidth = tileWidth / 2.2;
      spriteHeight = tileHeight / 1.1;

      return (
        <AnimatedSprite
          key={`${row}-${col}-sprite`}
          textures={frames}
          x={posX + xOffset}
          y={posY + yOffset}
          width={spriteWidth}
          height={spriteHeight}
          animationSpeed={0.1} // Animasyon hızını ayarlayın
          loop={true} // Döngü sürekli olsun
          initialFrame={0} // Başlangıç frame'i
          isPlaying={true} // Animasyon oynasın
          interactive={true}
          pointerover={(e) => (e.currentTarget.tint = 0xff0000)} // Üzerine gelindiğinde rengi değiştir
          pointerout={(e) => (e.currentTarget.tint = 0xffffff)} // Çıkıldığında eski rengine dön
          pointertap={() => handleItemClick(itemType, row, col)}
        />
      );
    } else if (itemType === "tree" && treeFrames.length > 0) {
      frames = treeFrames;
      xOffset = tileWidth / 1.7 / 2.3;
      yOffset = -(tileHeight * 1.6) / 2.3;
      spriteWidth = tileWidth / 1.7 / 1.2;
      spriteHeight = (tileHeight * 1.6) / 1.2;

      return (
        <AnimatedSprite
          key={`${row}-${col}-sprite`}
          textures={frames}
          x={posX + xOffset}
          y={posY + yOffset}
          width={spriteWidth}
          height={spriteHeight}
          animationSpeed={0.1} // Animasyon hızını ayarlayın
          loop={true} // Döngü sürekli olsun
          initialFrame={0} // Başlangıç frame'i
          isPlaying={true} // Animasyon oynasın
          interactive={true}
          pointerover={(e) => (e.currentTarget.tint = 0xff0000)} // Üzerine gelindiğinde rengi değiştir
          pointerout={(e) => (e.currentTarget.tint = 0xffffff)} // Çıkıldığında eski rengine dön
          pointertap={() => handleItemClick(itemType, row, col)}
        />
      );
    }

    // Diğer durumlar için statik sprite döndür
    return null;
  };

  const openModalWithContent = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };

  function renderMenu() {
    return (
      <div className="w-full max-w-screen-lg mx-auto flex flex-col items-center  -translate-y-10 pb-5">
        <div className="w-full relative">
          <img src="/board-header.png" alt="Header" className="w-full h-auto" />
          <h1 className="absolute top-3 text-xl font-bold w-full text-center ">
            {renderSelectedTitle()}
          </h1>
        </div>

        <div className="w-full min-h-[250px]     bg-[url('/board-content.png')] bg-repeat-y bg-contain">
          <div className="  flex px-7 -mt-2">{renderSelectedContent()}</div>
        </div>

        <div className="w-full relative">
          <img src="/board-footer.png" alt="Footer" className="w-full h-auto" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        {modalContent}
      </Modal>
      <motion.div
        className=" fixed top-4 left-4 text-white z-10 "
        initial={{ opacity: 0, x: -100 }} // Başlangıç durumu: Opaklık 0 ve yukarıda konumlanmış
        animate={{ opacity: 1, x: 0 }} // Hedef durum: Opaklık 1 ve y ekseninde normal konum
        transition={{ duration: 1 }}
      >
        <div className=" flex flex-col gap-2">
          {[
            { title: "GMOVE", count: para, image: "/movementoken.png" },
            {
              title: "Resources",
              count: kaynak,
              image: "/kaynak.png",
              timer: true,
            },
          ].map((item, index) => (
            <div>
              <div
                key={index}
                className="relative flex items-center justify-center "
              >
                <img src="/item-show-bg.png" className="w-[160px]  " />
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center w-full  ">
                  <img alt={item.title} src={item.image} className="size-6 " />
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
                  {parseInt(kaynak) > 0 ? (
                    <p className="absolute w-full text-center text-sm top-1/2 -translate-y-1/2 text-black text-opacity-80  ">
                      23:49:50
                    </p>
                  ) : (
                    <button
                      onClick={() => setKaynak(kaynak + 1)}
                      className="absolute w-full text-center text-sm top-1/2 -translate-y-1/2 text-black text-opacity-80  "
                    >
                      Claim
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
      <Stage
        width={windowSize.width}
        height={windowSize.height}
        className=" fixed z-0 bg-gradient-to-b to-85% from-[#a1e2f2] to-[#72bed5]"
        options={{
          backgroundAlpha: 0,
          resizeTo: typeof window !== "undefined" ? window : null,
        }}
      >
        <Container
          x={windowSize.width / 2 - (tileWidth * scaleFactor) / 2}
          y={windowSize.height / 2 - tileHeight * 2.2 * scaleFactor - 40}
          scale={{ x: scaleFactor, y: scaleFactor }}
        >
          <Sun />
          {dryTexture && houseTexture && renderGrid()}
        </Container>
      </Stage>
      <motion.img
        src="/sidemenu-title.png"
        className=" fixed top-0 left-1/2 transform -translate-x-1/2  w-[250px] -ml-[200px]  !hidden md:block "
        initial={{ opacity: 0, y: -100 }} // Başlangıç durumu: Opaklık 0 ve yukarıda konumlanmış
        animate={{ opacity: 1, y: 0 }} // Hedef durum: Opaklık 1 ve y ekseninde normal konum
        transition={{ duration: 1 }} // Geçiş süresi 1 saniye
      />

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
            <img
              src="/board-header.png"
              alt="Header"
              className="w-full h-auto"
            />
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
            <img
              src="/board-footer.png"
              alt="Footer"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GameScene;
