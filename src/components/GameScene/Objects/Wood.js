// src/components/GameScene/Objects/Wood.js
"use client";
import React, { useEffect, useState } from "react";
import { AnimatedSprite } from "@pixi/react";
import * as PIXI from "pixi.js";
import useTilePosition from "@/hooks/useTilePosition";

const Wood = ({ row, col, onClick }) => {
  const [woodFrames, setWoodFrames] = useState([]);
  const { calculateTilePosition } = useTilePosition();

  useEffect(() => {
    const frames = [
      PIXI.Texture.from("/kaynak/kaynak0.png"),
      PIXI.Texture.from("/kaynak/kaynak1.png"),
    ];
    setWoodFrames(frames);
  }, []);

  const { x, y } = calculateTilePosition(row, col);

  if (woodFrames.length > 0) {
    return (
      <AnimatedSprite
        textures={woodFrames}
        x={x + ((128 / 3) * 1.4) / 2}
        y={y}
        width={(128 / 3) * 1.4}
        height={(64 / 2) * 1.5}
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

export default Wood;
