"use client";
import { useCallback } from "react";

const useTilePosition = (tileWidth = 128, tileHeight = 64) => {
  const calculateTilePosition = useCallback(
    (row, col) => {
      const x = (col - row) * (tileWidth / 2);
      const y = (col + row) * (tileHeight / 2.1);

      return { x, y };
    },
    [tileWidth, tileHeight]
  );

  return { calculateTilePosition };
};

export default useTilePosition;
