import useTilePosition from "@/hooks/useTilePosition";
import { Sprite } from "@pixi/react";

import * as PIXI from "pixi.js";

const GridTile = ({
  row,
  col,
  // x,
  // y,
  texture,
  interactive,
  onPointerOver,
  onPointerOut,
  onClick,
  tint,
}) => {
  const { calculateTilePosition } = useTilePosition();

  const tileWidth = 128;
  const tileHeight = 64;
  const { x, y } = calculateTilePosition(row, col);

  // İzometrik hit area tanımlama
  const hitArea = new PIXI.Polygon([
    new PIXI.Point(tileWidth / 2, 0), // Üst köşe
    new PIXI.Point(tileWidth, tileHeight / 2), // Sağ köşe
    new PIXI.Point(tileWidth / 2, tileHeight), // Alt köşe
    new PIXI.Point(0, tileHeight / 2), // Sol köşe
  ]);

  return (
    <Sprite
      texture={texture}
      x={x}
      y={y}
      tint={tint}
      width={tileWidth}
      height={tileHeight}
      interactive={interactive}
      hitArea={hitArea}
      pointerover={onPointerOver}
      pointerout={onPointerOut}
      pointertap={onClick}
    />
  );
};

export default GridTile;
