"use client";
import { Stage, Container } from "@pixi/react";
import { useEffect, useRef, useState } from "react";

import InventoryItem from "@/components/Page/InventoryItem";
import GridTile from "@/components/GameScene/Grid/GridTile";
import Tractor from "@/components/GameScene/Objects/Tractor";
import Tree from "@/components/GameScene/Objects/Tree";
import Windmill from "@/components/GameScene/Objects/Windmill";
import Wood from "@/components/GameScene/Objects/Wood";
import House from "@/components/GameScene/Objects/House";
import FenceLeft from "@/components/GameScene/Objects/Fence/FenceLeft";
import FenceRight from "@/components/GameScene/Objects/Fence/FenceRight";

import Sun from "@/components/GameScene/Objects/Sun";
import {
  FENCE_LEFT_POSITIONS,
  FENCE_RIGHT_POSITIONS,
  GRID_SIZE,
  TILE_HEIGHT,
  TILE_WIDTH,
} from "@/constants/grid";

const GameScene = ({
  gridState,
  kaynak,
  setKaynak,
  openModalWithContent,
  claimResource,
  setIsModalOpen,
  inventory,
  setInventory,
  setSelectedItem,
  selectedItem,
  setShowSideMenu,
  setSelectedContent,
}) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 800,
    height: typeof window !== "undefined" ? window.innerHeight : 600,
  });

  const [scaleFactor, setScaleFactor] = useState(1);

  // const [gridState, setGridState] = useState(
  //   Array(GRID_SIZE)
  //     .fill(null)
  //     .map(() => Array(GRID_SIZE).fill("dry"))
  // );

  // const [gridState, setGridState] = useState([
  //   ["dry", "dry", "dry", "dry", "dry", "dry", "dry"],
  //   ["dry", "dry", "dry", "dry", "dry", "dry", "dry"],
  //   ["dry", "dry", "dry", "dry", "dry", "dry", "dry"],
  //   ["grass", "dry", "dry", "dry", "dry", "dry", "dry"],
  //   ["tree", "dry", "dry", "dry", "dry", "dry", "dry"],
  //   ["grass", "dry", "dry", "dry", "dry", "dry", "dry"],
  //   ["dry", "dry", "dry", "dry", "dry", "dry", "tractor"],
  // ]);

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
    };

    window.addEventListener("resize", handleResize);

    // Initial scale factor and stage position calculation
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleTileClick = (row, col) => {
    if (gridState[row][col] === "dry") {
      if (kaynak > 0) {
        // spendResource(1, `[${row},${col}]`);
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
                  // setKaynak((kaynak) => kaynak + 1);
                  claimResource();
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

  const renderGrid = () => {
    const zeminIzgara = [];
    const sabitObjeler = [];
    const dinamikObjeler = [];

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const tileType = getTileTexture(row, col);
        const interactive = isTileInteractive(row, col);

        zeminIzgara.push(
          <GridTile
            key={`tile-${row}-${col}`}
            tileType={tileType}
            row={row}
            col={col}
            interactive={interactive}
            onClick={() => handleTileClick(row, col)}
          />
        );

        if (
          FENCE_LEFT_POSITIONS.some(
            ([fenceRow, fenceCol]) => fenceRow === row && fenceCol === col
          )
        ) {
          sabitObjeler.push(
            <FenceLeft key={`fence-left-${row}-${col}`} row={row} col={col} />
          );
        }

        if (
          FENCE_RIGHT_POSITIONS.some(
            ([fenceRow, fenceCol]) => fenceRow === row && fenceCol === col
          )
        ) {
          sabitObjeler.push(
            <FenceRight key={`fence-right-${row}-${col}`} row={row} col={col} />
          );
        }

        if (gridState[row][col] === "tractor") {
          dinamikObjeler.push(
            <Tractor
              key={`tractor-${row}-${col}`}
              row={row}
              col={col}
              onClick={() => handleItemClick(gridState[row][col], row, col)}
            />
          );
        }
        if (gridState[row][col] === "tree") {
          dinamikObjeler.push(
            <Tree
              key={`tree-${row}-${col}`}
              row={row}
              col={col}
              onClick={() => handleItemClick(gridState[row][col], row, col)}
            />
          );
        }
      }
    }

    sabitObjeler.push(
      <House
        key={`house`}
        row={0}
        col={0}
        onClick={() => {
          setSelectedContent("home");
          setShowSideMenu(true);
        }}
      />
    );
    sabitObjeler.push(
      <Windmill
        key={`windmill`}
        row={0}
        col={3}
        onClick={() => {
          setSelectedContent("missions");
          setShowSideMenu(true);
        }}
      />
    );

    sabitObjeler.push(
      <Wood
        key={`wood`}
        row={0}
        col={2}
        onClick={() => {
          // setKaynak(kaynak + 1);
          claimResource();
          setSelectedContent("resource");
          setShowSideMenu(true);
        }}
      />
    );

    return [...zeminIzgara, ...sabitObjeler, ...dinamikObjeler];
  };

  const getTileTexture = (row, col) => {
    const isUnderObject = isTileUnderObject(row, col);
    return isUnderObject
      ? "grass"
      : gridState[row][col] === "dry"
      ? "dry"
      : "grass";
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

  return (
    <>
      <div className=" absolute left-[200px] top-5 z-[9999]  mx-auto ml-10">
        <button
          onClick={() => {
            console.log(gridState);
          }}
        >
          gridState
        </button>
      </div>
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
          x={windowSize.width / 2 - (TILE_WIDTH * scaleFactor) / 2}
          y={windowSize.height / 2 - TILE_HEIGHT * 2.2 * scaleFactor - 40}
          scale={{ x: scaleFactor, y: scaleFactor }}
        >
          <Sun scaleFactor={scaleFactor} windowSize={windowSize} />
          {renderGrid()}
        </Container>
      </Stage>
    </>
  );
};

export default GameScene;
