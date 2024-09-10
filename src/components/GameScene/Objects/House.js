"use client";
import React, { useEffect, useState } from "react";
import useTilePosition from "@/hooks/useTilePosition";
import * as PIXI from "pixi.js";
import { Sprite } from "@pixi/react";

const House = ({ row, col, onClick }) => {
  const { calculateTilePosition } = useTilePosition();
  const [houseTexture, setHouseTexture] = useState(null);

  const houseWidth = 128 * 1.5; // Varsayılan değerler üzerinden hesapla
  const houseHeight = 130;

  const { x, y } = calculateTilePosition(row, col);

  useEffect(() => {
    // Texture'i yükleyin ve state olarak ayarlayın
    const texture = PIXI.Texture.from("/ev.png");
    setHouseTexture(texture);
  }, []);

  if (!houseTexture) {
    // Texture yüklenmediyse, null döndürerek bileşeni render etme
    return null;
  }

  return (
    <Sprite
      texture={houseTexture}
      x={x - 128 / 3.7}
      y={y - houseHeight + 64 + 64 / 2 + 64 / 5}
      width={houseWidth}
      height={houseHeight}
      tintOver={0xffa500}
      interactive={true}
      pointertap={onClick}
      pointerover={(e) => {
        e.currentTarget.tint = "0xffa500";
      }}
      pointerout={(e) => {
        e.currentTarget.tint = 0xffffff;
      }}
    />
  );
};

export default House;
