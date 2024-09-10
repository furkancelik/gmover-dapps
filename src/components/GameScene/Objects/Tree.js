"use client";
import React, { useEffect, useState } from "react";
import { AnimatedSprite } from "@pixi/react";
import * as PIXI from "pixi.js";
import useTilePosition from "@/hooks/useTilePosition";

const Tree = ({ row, col, onClick }) => {
  const [treeFrames, setTreeFrames] = useState([]);
  const { calculateTilePosition } = useTilePosition();

  useEffect(() => {
    const frames = [
      PIXI.Texture.from("/agac/agac0.png"),
      PIXI.Texture.from("/agac/agac2.png"),
      PIXI.Texture.from("/agac/agac3.png"),
      PIXI.Texture.from("/agac/agac3-1.png"),
      PIXI.Texture.from("/agac/agac3-2.png"),
      PIXI.Texture.from("/agac/agac3-3.png"),
      PIXI.Texture.from("/agac/agac4.png"),
      PIXI.Texture.from("/agac/agac4-1.png"),
      PIXI.Texture.from("/agac/agac4-2.png"),
      PIXI.Texture.from("/agac/agac4-3.png"),
      PIXI.Texture.from("/agac/agac5.png"),
      PIXI.Texture.from("/agac/agac6.png"),
      PIXI.Texture.from("/agac/agac7.png"),
    ];
    setTreeFrames(frames);
  }, []);

  const { x, y } = calculateTilePosition(row, col);

  const xOffset = 128 / 1.7 / 2.3;
  const yOffset = -(64 * 1.6) / 2.3;
  const spriteWidth = 128 / 1.7 / 1.2;
  const spriteHeight = (64 * 1.6) / 1.2;

  if (treeFrames.length > 0) {
    return (
      <AnimatedSprite
        textures={treeFrames}
        x={x + xOffset}
        y={y + yOffset}
        width={spriteWidth}
        height={spriteHeight}
        animationSpeed={0.1}
        loop={true}
        isPlaying={true}
        interactive={true}
        pointerover={(e) => (e.currentTarget.tint = 0xff0000)}
        pointerout={(e) => (e.currentTarget.tint = 0xffffff)}
        pointertap={onClick}
      />
    );
  }
  return null;
};

export default Tree;
