// src/components/GameScene/Objects/Tractor.js
"use client";
import React, { useEffect, useState } from "react";
import { AnimatedSprite } from "@pixi/react";
import * as PIXI from "pixi.js";
import useTilePosition from "@/hooks/useTilePosition";

const Tractor = ({ row, col, onClick }) => {
  const [tractorFrames, setTractorFrames] = useState([]);
  const { calculateTilePosition } = useTilePosition();

  useEffect(() => {
    const frames = [
      PIXI.Texture.from("/tractor/tractor1.png"),
      PIXI.Texture.from("/tractor/tractor2.png"),
      PIXI.Texture.from("/tractor/tractor3.png"),
      PIXI.Texture.from("/tractor/tractor4.png"),
      PIXI.Texture.from("/tractor/tractor5.png"),
      PIXI.Texture.from("/tractor/tractor6.png"),
      PIXI.Texture.from("/tractor/tractor3.png"),
      PIXI.Texture.from("/tractor/tractor1.png"),
    ];
    setTractorFrames(frames);
  }, []);

  const { x, y } = calculateTilePosition(row, col);

  if (tractorFrames.length > 0) {
    return (
      <AnimatedSprite
        key={`tractor-${row}-${col}`}
        textures={tractorFrames}
        x={x + 34}
        y={y - 12}
        width={128 / 2.2}
        height={64 / 1.1}
        animationSpeed={0.1} // Animasyon hızını ayarlayın
        loop={true} // Döngü sürekli olsun
        initialFrame={0} // Başlangıç frame'i
        isPlaying={true} // Animasyon oynasın
        interactive={true}
        pointerover={(e) => (e.currentTarget.tint = 0xff0000)} // Üzerine gelindiğinde rengi değiştir
        pointerout={(e) => (e.currentTarget.tint = 0xffffff)} // Çıkıldığında eski rengine dön
        // pointertap={() => handleItemClick(itemType, row, col)}
        pointertap={onClick}
      />
    );
  }
  return null;

  return (
    <AnimatedSprite
      textures={tractorFrames}
      x={x + 34}
      y={y - 12}
      width={128 / 2.2}
      height={64 / 1.1}
      animationSpeed={0.1}
      loop={true}
      isPlaying={true}
      interactive={true}
      pointerover={(e) => (e.currentTarget.tint = 0xff0000)}
      pointerout={(e) => (e.currentTarget.tint = 0xffffff)}
      pointertap={onClick}
    />
  );
};

export default Tractor;
