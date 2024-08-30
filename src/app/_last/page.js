"use client";
import {
  Stage,
  Container,
  Sprite,
  AnimatedSprite,
  Graphics,
} from "@pixi/react";
import { useEffect, useState } from "react";
import * as PIXI from "pixi.js";
import { PiFarm } from "react-icons/pi";

import { GlowFilter } from "@pixi/filter-glow";

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
      click={onClick}
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

const GameScene = () => {
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
  const [inventory, setInventory] = useState({ tree: 0, tractor: 0 }); // Alınan öğeleri izlemek için inventory
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
  const gridSize = 6;

  const [gridState, setGridState] = useState(
    Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill("dry"))
  );

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

  const handleTileClick = (row, col) => {
    if (gridState[row][col] === "dry") {
      if (kaynak > 0) {
        setKaynak(kaynak - 1);
        const newGridState = [...gridState];
        newGridState[row][col] = "grass";
        setGridState(newGridState);
      } else {
        alert("Yetersiz kaynak! Daha fazla kaynak toplamalısınız.");
      }
    } else if (gridState[row][col] === "grass") {
      if (selectedItem) {
        if (inventory[selectedItem] > 0) {
          const newGridState = [...gridState];
          newGridState[row][col] = selectedItem;
          setGridState(newGridState);
          setInventory((prevInventory) => ({
            ...prevInventory,
            [selectedItem]: prevInventory[selectedItem] - 1,
          }));
          setSelectedItem(null);
        } else {
          alert("Seçtiğiniz öğe envanterinizde yok!");
        }
      } else {
        alert("Lütfen ekilecek bir öğe seçin.");
      }
    }
  };

  const handleItemClick = (itemType, row, col) => {
    setSelectedInfo({ itemType, row, col });
  };

  const handleRemoveItem = () => {
    if (selectedInfo) {
      const { row, col } = selectedInfo;
      const newGridState = [...gridState];
      newGridState[row][col] = "grass"; // Öğeyi kaldır ve tekrar grass yap
      setGridState(newGridState);
      setSelectedInfo(null);
    }
  };

  const handlePurchase = (item) => {
    const cost = item === "tree" ? 50 : 250;
    if (para >= cost) {
      setPara(para - cost);
      setInventory((prevInventory) => ({
        ...prevInventory,
        [item]: prevInventory[item] + 1,
      }));
    } else {
      alert("Yetersiz para! Bu öğeyi satın alamazsınız.");
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
    const sideMenuWidth = window.innerWidth * 0.25; // %25 oranını burada hesaplıyoruz

    const xOffset = window.innerWidth / 2 - tileWidth / 2;
    const yOffset =
      (window.innerHeight - tileHeight * gridSize) / 2 + tileHeight * 2;

    return { posX: x + xOffset - sideMenuWidth / 2, posY: y + yOffset };
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
        interactive={false}
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
        pointertap={() => setKaynak(kaynak + 1)}
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
        // pointertap={() => setKaynak(kaynak + 1)}
      />
    );
  };

  // Güneş resmi için bir sprite oluşturuyoruz
  const Sun = () => {
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
        x={window.innerWidth - window.innerWidth * 0.25 - 80}
        y={-20}
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

  return (
    <>
      <div className=" fixed top-4 left-4 text-white z-10">
        <div className=" flex flex-col gap-2">
          {Array(4)
            .fill(null)
            .map(() => (
              <div className="bg-gradient-to-r from-black/60 flex flex-row items-center justify-center py-1 px-3 pr-8 rounded-2xl rounded-e-none text-sm">
                <img src="kaynak.png" className="size-7 mr-2 object-contain" />{" "}
                19 Kaynak
              </div>
            ))}
        </div>
      </div>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        className=" fixed z-0 bg-gradient-to-b from-[#99dbec] to-[#72bed5]"
        options={{
          backgroundAlpha: 0,
          resizeTo: window,
        }}
      >
        <Sun />
        {dryTexture && houseTexture && renderGrid()}
      </Stage>

      <img
        src="/sidemenu-title.png"
        className=" fixed top-0 left-1/2 transform -translate-x-1/2  w-[250px] -ml-[125px]  "
      />

      <div className=" w-1/4 absolute top-0 right-0 h-screen ">
        {/* <img src="/sidemenu-title.png" className="w-full px-14 z-20 relative" /> */}
        <div className="-ml-24 z-10 relative mt-4">
          <img src="/right-dal.png" className="w-full " />
        </div>
        <div className="flex flex-row justify-center gap-4 ">
          {[
            { icon: PiFarm, image: "home-button-bg.png" },
            { icon: PiFarm, title: "Market", image: "market-button-bg.png" },
            { icon: PiFarm, title: "Kaynak", image: "wood-button-bg.png" },
            { icon: PiFarm, title: "Görevler", image: "will-button-bg.png" },
          ].map((v, i) => (
            <button
              className={`w-full flex items-center justify-center -translate-y-14 z-20 hover:rotate-6 origin-top transition-all duration-300 drop-shadow-lg cursor-pointer `}
              key={i}
            >
              <img src={v.image} />
            </button>
          ))}
        </div>

        <div className="w-full max-w-screen-lg mx-auto flex flex-col items-center  -translate-y-10 pb-5">
          <div className="w-full relative">
            <img
              src="/board-header.png"
              alt="Header"
              className="w-full h-auto"
            />
            <h1 className="absolute top-3 text-xl font-bold w-full text-center ">
              Gmover Farm
            </h1>
          </div>

          {/* <div className="w-full relative min-h-[600px]">
            <img src="/board-content.png" alt="Content" className="w-full h-auto" />
            <div className="absolute top-0 left-0 w-full h-full flex px-7 -mt-2">
              <p className=" text-black">Buraya farklı içerikler gelecek.</p>
            </div>
          </div> */}
          <div className="w-full relative min-h-[600px] bg-[url('/board-content.png')] bg-repeat-y bg-contain">
            <div className="absolute top-0 left-0 w-full h-full flex px-7 -mt-2">
              <p className="text-black">Buraya farklı içerikler gelecek.</p>
            </div>
          </div>

          <div className="w-full relative">
            <img
              src="/board-footer.png"
              alt="Footer"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* <div className="mt-4 pb-5 flex flex-col items-center justify-center">
          <div className="bg-[url('/board-header.png')] bg-top bg-contain bg-no-repeat  w-full">
            <h3 className=" text-center  font-semibold text-lg pt-3 pb-11">
              Gmover Farming
            </h3>
          </div>
          <div className="bg-[url('/board-content.png')] bg-contain bg-top bg-repeat-y  px-8 w-full min-h-[600px] -mt-2 ">
            Lorem ipsum dolar sit amet lorem ipsum dolar sit amet lorem ipsum
            dolar sit amet lipsum dolar sit amet loram dolar sit amet ipsum
          </div>
          <div className="bg-[url('/board-footer.png')] bg-contain bg-left-top bg-no-repeat p-7 w-full"></div>
        </div> */}
      </div>
    </>
  );
};

export default GameScene;

{
  /* <div className="absolute top-4 left-4 text-white">
  <p>Para: {para}</p>
  <p>Kaynak: {kaynak}</p>
  <div className="mb-4">
    <h3>Market</h3>
    <button onClick={() => handlePurchase("tree")}>Ağaç Satın Al (50)</button>
    <button onClick={() => handlePurchase("tractor")}>
      Traktör Satın Al (250)
    </button>
  </div>
  <div className="mb-4">
    <h3>Seçim</h3>
    <button
      onClick={() => setSelectedItem("tree")}
      disabled={inventory.tree === 0}
    >
      Ağaç ({inventory.tree})
    </button>
    <button
      onClick={() => setSelectedItem("tractor")}
      disabled={inventory.tractor === 0}
    >
      Traktör ({inventory.tractor})
    </button>
  </div>

  <div className="mb-4">
    <h3>Seçili Öğenin Bilgisi</h3>
    {selectedInfo ? (
      <>
        <p>Öğe: {selectedInfo.itemType}</p>
        <button onClick={handleRemoveItem}>Öğeyi Kaldır</button>
      </>
    ) : (
      <p>Herhangi bir öğe seçili değil</p>
    )}
  </div>
</div>; */
}
