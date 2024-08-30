"use client";
import { Stage, Sprite, Container, Graphics } from "@pixi/react";
import { useEffect, useState } from "react";
import * as PIXI from "pixi.js";

const GameScene = () => {
  const [dryTexture, setDryTexture] = useState(null);
  const [grassTexture, setGrassTexture] = useState(null); // Yeşil çimen dokusunu ekle
  const [houseTexture, setHouseTexture] = useState(null);
  const [woodTexture, setWoodTexture] = useState(null); // Odun dokusunu ekle
  const [treeTexture, setTreeTexture] = useState(null); // Ağaç dokusunu ekle

  const tileWidth = 128; // Her bir karonun genişliği
  const tileHeight = 64; // Her bir karonun yüksekliği
  const houseWidth = tileWidth * 1.5; // Evin genişliği (2x2 alanı kaplayacak)
  const houseHeight = 130; // Evin yüksekliği (biraz daha yüksek olabilir)
  const gridSize = 6; // Izgara boyutu (6x6)

  useEffect(() => {
    // Kurak alan dokusunu yükleme
    const dry = PIXI.Texture.from("/a.png");
    setDryTexture(dry);

    // Ev dokusunu yükleme
    const house = PIXI.Texture.from("/ev.png");
    setHouseTexture(house);

    // Odun dokusunu yükleme
    const wood = PIXI.Texture.from("/kaynak.png");
    setWoodTexture(wood);

    // Ağaç dokusunu yükleme
    const tree = PIXI.Texture.from("/agac.png"); // Ağaç dokusunun yolunu belirtin
    setTreeTexture(tree);

    const grass = PIXI.Texture.from("/b.png");
    setGrassTexture(grass);
  }, []);

  const renderGrid = () => {
    const tiles = [];
    let topLeftTileX, topLeftTileY;
    let woodTileX, woodTileY;
    let treeTileX, treeTileY; // Ağaç konumu için değişkenler

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = (col - row) * (tileWidth / 2); // İzometrik x pozisyonu
        const y = (col + row) * (tileHeight / 2.1); // İzometrik y pozisyonu

        // Ekranı ortalamak için x ve y kaydırmaları
        const xOffset = window.innerWidth / 2 - tileWidth / 2;
        const yOffset =
          (window.innerHeight - tileHeight * gridSize) / 2 + tileHeight * 2;

        const posX = x + xOffset;
        const posY = y + yOffset;

        if (row === 0 && col === 0) {
          // İlk sprite'ın (0,0) konumunu kaydet
          topLeftTileX = posX;
          topLeftTileY = posY;
        }

        if (row === 0 && col === 2) {
          // Odun sprite'ının (2,0) konumunu kaydet
          woodTileX = posX;
          woodTileY = posY;
        }

        if (row === 2 && col === 0) {
          // Ağaç sprite'ının (0,2) konumunu kaydet
          treeTileX = posX;
          treeTileY = posY;
        }

        // İzometrik hit area tanımlama
        const hitArea = new PIXI.Polygon([
          new PIXI.Point(tileWidth / 2, 0), // Üst köşe
          new PIXI.Point(tileWidth, tileHeight / 2), // Sağ köşe
          new PIXI.Point(tileWidth / 2, tileHeight), // Alt köşe
          new PIXI.Point(0, tileHeight / 2), // Sol köşe
        ]);

        // Zemin için interaktifliği belirle
        const isUnderHouseOrWoodOrTree =
          (row === 0 && col === 0) ||
          (row === 0 && col === 1) ||
          (row === 1 && col === 0) ||
          (row === 1 && col === 1) ||
          (row === 2 && col === 0) ||
          (row === 0 && col === 2);

        const texture =
          (row === 0 && col === 0) ||
          (row === 0 && col === 1) ||
          (row === 1 && col === 0) ||
          (row === 1 && col === 1) ||
          (row === 2 && col === 0) ||
          (row === 0 && col === 2)
            ? grassTexture
            : dryTexture;

        tiles.push(
          <Sprite
            key={`${row}-${col}`}
            texture={texture}
            x={posX}
            y={posY}
            width={tileWidth}
            height={tileHeight}
            interactive={!isUnderHouseOrWoodOrTree} // Evin, odunun veya ağacın altındaki zemin interaktif olmasın
            hitArea={hitArea} // hitArea ile interaktif alanı belirleme
            pointerover={(e) => {
              e.currentTarget.tint = 0xaaaaff; // Üzerine gelindiğinde rengi değiştir
            }}
            pointerout={(e) => {
              e.currentTarget.tint = 0xffffff; // Çıkıldığında eski rengine dön
            }}
          />
        );
      }
    }

    // Evi (0,0), (0,1), (1,0), (1,1) sprite'larının üzerine konumlandırma
    const houseX = topLeftTileX;
    const houseY = topLeftTileY - houseHeight + tileHeight + tileHeight / 2;

    tiles.push(
      <Sprite
        key="house"
        texture={houseTexture}
        x={houseX - tileWidth / 3.7}
        y={houseY + tileHeight / 5}
        width={houseWidth} // Ev 2x2'lik bir alan kaplayacak şekilde genişlik
        height={houseHeight} // Ev biraz daha yüksek ayarlandı
        interactive={true} // Evi interaktif yapma
        pointerover={(e) => {
          e.currentTarget.tint = 0xffa500; // Üzerine gelindiğinde turuncu rengi (orange) uygula
        }}
        pointerout={(e) => {
          e.currentTarget.tint = 0xffffff; // Çıkıldığında eski rengine dön
        }}
      />
    );

    // Odun sprite'ını (2,0) konumuna ekleme ve interaktiflik ekleme
    tiles.push(
      <Sprite
        key="wood"
        texture={woodTexture}
        x={woodTileX + ((tileWidth / 3) * 1.4) / 2}
        y={woodTileY}
        width={(tileWidth / 3) * 1.4} // Odun 1x1'lik bir alan kaplayacak şekilde genişlik
        height={(tileHeight / 2) * 1.5} // Odun yüksekliği, karoya uygun olacak şekilde ayarlandı
        interactive={true} // Odun sprite'ını interaktif yapma
        pointerover={(e) => {
          e.currentTarget.tint = 0xffa500; // Üzerine gelindiğinde turuncu rengi (orange) uygula
        }}
        pointerout={(e) => {
          e.currentTarget.tint = 0xffffff; // Çıkıldığında eski rengine dön
        }}
      />
    );

    // Ağaç sprite'ını (0,2) konumuna ekleme ve interaktiflik ekleme
    tiles.push(
      <Sprite
        key="tree"
        texture={treeTexture}
        x={treeTileX + ((tileWidth / 3) * 1.4) / 2}
        y={treeTileY - (tileWidth / 3) * 1.4} // Ağaç yerden biraz daha yukarıda konumlandırılabilir
        width={tileWidth / 1.7} // Ağaç 1x1'lik bir alan kaplayacak şekilde genişlik
        height={tileHeight * 1.6} // Ağaç yüksekliği, karoya uygun olacak şekilde ayarlandı
        interactive={true} // Ağaç sprite'ını interaktif yapma
        pointerover={(e) => {
          e.currentTarget.tint = 0x32cd32; // Üzerine gelindiğinde yeşil rengi (limegreen) uygula
        }}
        pointerout={(e) => {
          e.currentTarget.tint = 0xffffff; // Çıkıldığında eski rengine dön
        }}
      />
    );

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
