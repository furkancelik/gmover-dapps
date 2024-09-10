"use client";
import React, { useEffect, useState } from "react";
import { Sprite } from "@pixi/react";
import * as PIXI from "pixi.js";
import useTilePosition from "@/hooks/useTilePosition";

const FenceLeft = ({ row, col }) => {
  const { calculateTilePosition } = useTilePosition();
  const [fenceLeftTexture, setFenceLeftTexture] = useState(null);

  const tileWidth = 128;
  const tileHeight = 64;

  const { x, y } = calculateTilePosition(row, col);

  useEffect(() => {
    const texture = PIXI.Texture.from("/cift_sola.png");
    setFenceLeftTexture(texture);
  }, []);

  if (!fenceLeftTexture) {
    return null;
  }

  return (
    <Sprite
      key={`fence-left-${row}-${col}`}
      texture={fenceLeftTexture}
      x={x - 6}
      y={y - tileHeight / 2 - 10}
      width={tileWidth / 2 + 6}
      height={tileHeight + 10}
      interactive={false}
    />
  );
};

export default FenceLeft;
