"use client";
import { Stage, Container, Sprite } from "@pixi/react";
import { useEffect, useState } from "react";
import * as PIXI from "pixi.js";

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
      click={onClick} // Tıklama olayını ekliyoruz
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
      e.currentTarget.tint = tintOver; // Üzerine gelindiğinde rengi değiştir
    }}
    pointerout={(e) => {
      e.currentTarget.tint = 0xffffff; // Çıkıldığında eski rengine dön
    }}
    {...props}
  />
);

const GameScene = () => {
  const [selectedItem, setSelectedItem] = useState(null); // Seçilen sprite (traktör veya ağaç)
  const [kaynak, setKaynak] = useState(0); // Kaynak değerini takip eden state
  const [dryTexture, setDryTexture] = useState(null);
  const [grassTexture, setGrassTexture] = useState(null); // Yeşil çimen dokusunu ekle
  const [houseTexture, setHouseTexture] = useState(null);
  const [woodTexture, setWoodTexture] = useState(null); // Odun dokusunu ekle
  const [treeTexture, setTreeTexture] = useState(null); // Ağaç dokusunu ekle
  const [windmillTexture, setWindmillTexture] = useState(null); // Değirmen dokusunu ekle
  const [tractorTexture, setTractorTexture] = useState(null); // Traktör dokusunu ekle
  const [trees, setTrees] = useState([]); // Ağaçları takip etmek için bir state

  const tileWidth = 128; // Her bir karonun genişliği
  const tileHeight = 64; // Her bir karonun yüksekliği
  const houseWidth = tileWidth * 1.5; // Evin genişliği (2x2 alanı kaplayacak)
  const houseHeight = 130; // Evin yüksekliği (biraz daha yüksek olabilir)
  const gridSize = 6; // Izgara boyutu (6x6)

  const [gridState, setGridState] = useState(
    Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill("dry")) // Başlangıçta tüm alanlar "dry" olacak
  );

  useEffect(() => {
    const dry = PIXI.Texture.from("/a.png");
    setDryTexture(dry);

    const house = PIXI.Texture.from("/ev.png");
    setHouseTexture(house);

    const wood = PIXI.Texture.from("/kaynak2.png");
    setWoodTexture(wood);

    const tree = PIXI.Texture.from("/agac.png");
    setTreeTexture(tree);

    const grass = PIXI.Texture.from("/b.png");
    setGrassTexture(grass);

    const windmill = PIXI.Texture.from("/degirmen.png"); // Değirmen dokusunun yolunu belirtin
    setWindmillTexture(windmill);

    const tractor = PIXI.Texture.from("/tractor.png"); // Traktör dokusunun yolunu belirtin
    setTractorTexture(tractor);
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
        const newGridState = [...gridState];
        newGridState[row][col] = selectedItem; // Seçilen öğeyi araziye ekle
        setGridState(newGridState);
        setSelectedItem(null); // Seçimden sonra öğeyi sıfırla
      } else {
        alert("Lütfen ekilecek bir öğe seçin.");
      }
    }
  };

  const renderGrid = () => {
    const tiles = [];
    const zeminIzgara = [];
    const sabitObjeler = [];
    const dinamikObjeler = [];

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
            onPointerOver={(e) => (e.currentTarget.tint = 0xaaaaff)}
            onPointerOut={(e) => (e.currentTarget.tint = 0xffffff)}
            onClick={() => handleTileClick(row, col)}
          />
        );

        if (
          gridState[row][col] === "tractor" ||
          gridState[row][col] === "tree"
        ) {
          dinamikObjeler.push(renderDynamicObject(row, col, posX, posY));
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

    const xOffset = window.innerWidth / 2 - tileWidth / 2;
    const yOffset =
      (window.innerHeight - tileHeight * gridSize) / 2 + tileHeight * 2;

    return { posX: x + xOffset, posY: y + yOffset };
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
      <InteractiveSprite
        key="wood"
        texture={woodTexture}
        x={posX + ((tileWidth / 3) * 1.4) / 2}
        y={posY}
        width={(tileWidth / 3) * 1.4}
        height={(tileHeight / 2) * 1.5}
        tintOver={0xffa500}
        click={() => setKaynak(kaynak + 1)}
        interactive={true}
      />
    );
  };

  const renderWindmill = () => {
    const { posX, posY } = calculateTilePosition(0, 3);
    return (
      <InteractiveSprite
        key="windmill"
        texture={windmillTexture}
        x={posX + tileWidth / 2 - 40}
        y={posY - tileWidth / 2 + 15}
        width={tileWidth / 1.8}
        height={tileHeight * 1.4}
        tintOver={0xffa500}
        interactive={false}
      />
    );
  };

  const renderDynamicObject = (row, col, posX, posY) => {
    const spriteTexture =
      gridState[row][col] === "tractor" ? tractorTexture : treeTexture;
    const xOffset =
      gridState[row][col] === "tractor" ? 34 : tileWidth / 1.7 / 2.3;
    const yOffset =
      gridState[row][col] === "tractor" ? -12 : -(tileHeight * 1.6) / 2.3;
    const spriteWidth =
      gridState[row][col] === "tractor"
        ? tileWidth / 2.2
        : tileWidth / 1.7 / 1.2;
    const spriteHeight =
      gridState[row][col] === "tractor"
        ? tileHeight / 1.1
        : (tileHeight * 1.6) / 1.2;

    return (
      <InteractiveSprite
        key={`${row}-${col}-sprite`}
        texture={spriteTexture}
        x={posX + xOffset}
        y={posY + yOffset}
        width={spriteWidth}
        height={spriteHeight}
        tintOver={0xffa500}
        interactive={true}
      />
    );
  };

  return (
    <>
      <div className="absolute top-4 left-4 text-white">
        <p>Kaynak: {kaynak}</p>
        <button onClick={() => setSelectedItem("tree")}>Ağaç Ekle</button>
        <button onClick={() => setSelectedItem("tractor")}>Traktör Ekle</button>
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        options={{ backgroundColor: 0x1099bb, resizeTo: window }}
      >
        {dryTexture && houseTexture && renderGrid()}
      </Stage>
    </>
  );
};

export default GameScene;
