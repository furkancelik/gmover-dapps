"use client";
import React, { useEffect, useState } from "react";

import useTilePosition from "@/hooks/useTilePosition";
import * as PIXI from "pixi.js";
import { Sprite } from "@pixi/react";

const DryTile = ({
  row,
  col,
  onClick,
  interactive,
  // onPointerOut,
  // onPointerOver,
  // hitArea,
  // tint,
}) => {
  const { calculateTilePosition } = useTilePosition();
  const [dryTileTexture, setDryTileTexture] = useState(null);

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
    const dry = PIXI.Texture.from("/a.png");
    setDryTileTexture(dry);
  }, []);

  if (!dryTileTexture) {
    // Texture yüklenmediyse, null döndürerek bileşeni render etme
    return null;
  }

  return (
    <Sprite
      key={`dry-tile-${row}-${col}`}
      texture={dryTileTexture}
      x={x}
      y={y}
      width={tileWidth}
      height={tileHeight}
      hitArea={hitArea}
      tint={0xffffff}
      // interactive={interactive}
      // hitArea={hitArea}
      // pointerover={onPointerOver}
      // pointerout={onPointerOut}
      interactive={interactive}
      pointerover={(e) => interactive && (e.currentTarget.tint = 0xaaaaff)}
      pointerout={(e) => interactive && (e.currentTarget.tint = 0xffffff)}
      pointertap={onClick}
    />
  );
};

export default DryTile;
