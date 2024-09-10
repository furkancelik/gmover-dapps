// src/components/GameScene/Objects/Windmill.js
"use client";
import React, { useEffect, useState } from "react";
import { AnimatedSprite } from "@pixi/react";
import * as PIXI from "pixi.js";
import useTilePosition from "@/hooks/useTilePosition";

const Windmill = ({ row, col, onClick }) => {
  const [windmillFrames, setWindmillFrames] = useState([]);
  const { calculateTilePosition } = useTilePosition();

  useEffect(() => {
    const frames = [
      PIXI.Texture.from("/degirmen/degirmen0.png"),
      PIXI.Texture.from("/degirmen/degirmen1.png"),
      PIXI.Texture.from("/degirmen/degirmen2.png"),
    ];
    setWindmillFrames(frames);
  }, []);

  const { x, y } = calculateTilePosition(row, col);

  if (windmillFrames.length > 0) {
    return (
      <AnimatedSprite
        textures={windmillFrames}
        x={x + 128 / 2 - 40}
        y={y - 128 / 2 + 15}
        width={128 / 1.8}
        height={64 * 1.4}
        animationSpeed={0.1} // Animasyon hızını ayarlayın
        loop={true} // Döngü sürekli olsun
        initialFrame={0} // Başlangıç frame'i
        isPlaying={true} // Animasyon oynasın
        interactive={true}
        pointerover={(e) => (e.currentTarget.tint = 0xff0000)} // Üzerine gelindiğinde rengi değiştir
        pointerout={(e) => (e.currentTarget.tint = 0xffffff)} // Çıkıldığında eski rengine dön
        pointertap={onClick} // Tıklama olayını işlemek için onClick kullanın
      />
    );
  }

  return null;
};

export default Windmill;
