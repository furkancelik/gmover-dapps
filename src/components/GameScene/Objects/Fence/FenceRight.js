"use client";
import React, { useEffect, useState } from "react";
import { Sprite } from "@pixi/react";
import * as PIXI from "pixi.js";
import useTilePosition from "@/hooks/useTilePosition";

const FenceRight = ({ row, col }) => {
  const { calculateTilePosition } = useTilePosition();
  const [fenceRightTexture, setFenceRightTexture] = useState(null);

  const tileWidth = 128;
  const tileHeight = 64;

  const { x, y } = calculateTilePosition(row, col);

  useEffect(() => {
    const texture = PIXI.Texture.from("/cift_saga.png");
    setFenceRightTexture(texture);
  }, []);

  if (!fenceRightTexture) {
    return null;
  }

  return (
    <Sprite
      key={`fence-right-${row}-${col}`}
      texture={fenceRightTexture}
      x={x + tileWidth / 2}
      y={y - tileHeight / 2 - 10}
      width={tileWidth / 2 + 6}
      height={tileHeight + 10}
      interactive={false}
    />
  );
};

export default FenceRight;
