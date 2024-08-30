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

  const handleTileClick = (x, y) => {
    setTrees((prevTrees) => [
      ...prevTrees,
      { x, y, key: `tree-${x}-${y}` }, // Ağacı tıklanan konuma ekle
    ]);
  };

  const renderGrid = () => {
    const tiles = [];
    let topLeftTileX, topLeftTileY;
    let woodTileX, woodTileY;
    let treeTileX, treeTileY;
    let windmillTileX, windmillTileY;
    let tractorTileX, tractorTileY;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = (col - row) * (tileWidth / 2); // İzometrik x pozisyonu
        const y = (col + row) * (tileHeight / 2.1); // İzometrik y pozisyonu

        const xOffset = window.innerWidth / 2 - tileWidth / 2;
        const yOffset =
          (window.innerHeight - tileHeight * gridSize) / 2 + tileHeight * 2;

        const posX = x + xOffset;
        const posY = y + yOffset;

        if (row === 0 && col === 0) {
          topLeftTileX = posX;
          topLeftTileY = posY;
        }

        if (row === 0 && col === 2) {
          woodTileX = posX;
          woodTileY = posY;
        }

        if (row === 2 && col === 0) {
          treeTileX = posX;
          treeTileY = posY;
        }

        if (row === 0 && col === 3) {
          windmillTileX = posX;
          windmillTileY = posY;
        }

        if (row === 0 && col === 4) {
          tractorTileX = posX;
          tractorTileY = posY;
        }

        const isUnderHouseOrWoodOrTree =
          (row === 0 && col === 0) ||
          (row === 0 && col === 1) ||
          (row === 1 && col === 0) ||
          (row === 1 && col === 1) ||
          (row === 2 && col === 0) ||
          (row === 0 && col === 2) ||
          (row === 0 && col === 3) ||
          (row === 0 && col === 4);

        const texture = isUnderHouseOrWoodOrTree ? grassTexture : dryTexture;

        tiles.push(
          <GridTile
            key={`${row}-${col}`}
            x={posX}
            y={posY}
            texture={texture}
            interactive={!isUnderHouseOrWoodOrTree}
            onPointerOver={(e) => (e.currentTarget.tint = 0xaaaaff)}
            onPointerOut={(e) => (e.currentTarget.tint = 0xffffff)}
            onClick={() => handleTileClick(posX, posY)} // Tıklama olayını handleTileClick ile işliyoruz
          />
        );
      }
    }

    const houseX = topLeftTileX;
    const houseY = topLeftTileY - houseHeight + tileHeight + tileHeight / 2;

    tiles.push(
      <InteractiveSprite
        key="house"
        texture={houseTexture}
        x={houseX - tileWidth / 3.7}
        y={houseY + tileHeight / 5}
        width={houseWidth}
        height={houseHeight}
        tintOver={0xffa500}
      />
    );

    tiles.push(
      <InteractiveSprite
        key="wood"
        texture={woodTexture}
        x={woodTileX + ((tileWidth / 3) * 1.4) / 2}
        y={woodTileY}
        width={(tileWidth / 3) * 1.4}
        height={(tileHeight / 2) * 1.5}
        tintOver={0xffa500}
      />
    );

    tiles.push(
      <InteractiveSprite
        key="windmill"
        texture={windmillTexture}
        x={windmillTileX + tileWidth / 2 - 40}
        y={windmillTileY - tileWidth / 2 + 15} // Değirmeni zeminden biraz yukarıda konumlandırmak için ayarlama yapıldı
        width={tileWidth / 1.8} // Değirmen 2x2'lik bir alan kaplayacak şekilde genişlik
        height={tileHeight * 1.4} // Değirmen yüksekliği, karoya uygun olacak şekilde ayarlandı
        tintOver={0xffa500}
      />
    );

    tiles.push(
      <InteractiveSprite
        key="tractor"
        texture={tractorTexture}
        x={tractorTileX + 34}
        y={tractorTileY - 12} // Traktörü zeminden biraz yukarıda konumlandırmak için ayarlama yapıldı
        width={tileWidth / 2.2} // Traktör 1x1'lik bir alan kaplayacak şekilde genişlik
        height={tileHeight / 1.1} // Traktör yüksekliği, karoya uygun olacak şekilde ayarlandı
        tintOver={0xffa500}
      />
    );

    tiles.push(
      <InteractiveSprite
        key="tree"
        texture={treeTexture}
        x={treeTileX + tileWidth / 1.7 / 2.3}
        y={treeTileY - (tileHeight * 1.6) / 2.3}
        width={tileWidth / 1.7 / 1.2}
        height={(tileHeight * 1.6) / 1.2}
        tintOver={0x32cd32}
      />
    );

    // Önceden eklenen ağaçları render ediyoruz
    trees.forEach((tree) => {
      tiles.push(
        <InteractiveSprite
          key={tree.key}
          texture={treeTexture}
          x={tree.x + tileWidth / 1.7 / 2.3}
          y={tree.y - (tileHeight * 1.6) / 2.3} // Ağaç yerden biraz daha yukarıda konumlandırılabilir
          width={tileWidth / 1.7 / 1.2}
          height={(tileHeight * 1.6) / 1.2}
          tintOver={0x32cd32}
        />
      );
    });

    return tiles;
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      options={{ backgroundColor: 0x1099bb, resizeTo: window }}
    >
      {dryTexture && houseTexture && renderGrid()}
    </Stage>
  );
};

export default GameScene;
