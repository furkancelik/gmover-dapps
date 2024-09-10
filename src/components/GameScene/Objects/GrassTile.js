"use client";
import React, { useEffect, useState } from "react";

import useTilePosition from "@/hooks/useTilePosition";
import * as PIXI from "pixi.js";
import { Sprite } from "@pixi/react";

const GrassTile = ({
  row,
  col,
  onClick,
  interactive,
  // onPointerOut,
  // onPointerOver,
  // hitArea,
  // interactive,
  // tint,
}) => {
  const { calculateTilePosition } = useTilePosition();
  const [grassTileTexture, setGrassTileTexture] = useState(null);

  const tileWidth = 128;
  const tileHeight = 64;

  const { x, y } = calculateTilePosition(row, col);

  const hitArea = new PIXI.Polygon([
    new PIXI.Point(tileWidth / 2, 0), // Üst köşe
    new PIXI.Point(tileWidth, tileHeight / 2), // Sağ köşe
    new PIXI.Point(tileWidth / 2, tileHeight), // Alt köşe
    new PIXI.Point(0, tileHeight / 2), // Sol köşe
  ]);

  useEffect(() => {
    // Texture'i yükleyin ve state olarak ayarlayın
    const grass = PIXI.Texture.from("/b.png");
    setGrassTileTexture(grass);
  }, []);

  if (!grassTileTexture) {
    // Texture yüklenmediyse, null döndürerek bileşeni render etme
    return null;
  }

  return (
    <Sprite
      key={`grass-tile-${row}-${col}`}
      texture={grassTileTexture}
      x={x}
      y={y}
      width={tileWidth}
      height={tileHeight}
      hitArea={hitArea}
      tint={0xffffff}
      interactive={interactive}
      pointerover={(e) => interactive && (e.currentTarget.tint = 0xaaaaff)}
      pointerout={(e) => interactive && (e.currentTarget.tint = 0xffffff)}
      pointertap={onClick}
    />
  );
};

export default GrassTile;
