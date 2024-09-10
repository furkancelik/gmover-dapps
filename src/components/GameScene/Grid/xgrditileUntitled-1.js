import useTilePosition from "@/hooks/useTilePosition";
import { Sprite } from "@pixi/react";

import * as PIXI from "pixi.js";
import DryTile from "../Objects/DryTile";
import GrassTile from "../Objects/GrassTile";

const GridTile = ({ tileType = "dry", row, col, onClick, interactive }) => {
  console.log("interactive:", interactive);
  if (tileType === "dry") {
    return (
      <DryTile
        interactive={interactive}
        onClick={onClick}
        row={row}
        col={col}
      />
    );
  } else if (tileType === "grass") {
    return (
      <GrassTile
        interactive={interactive}
        onClick={onClick}
        row={row}
        col={col}
      />
    );
  }
  // return (
  //   <Sprite
  //     texture={texture}
  //     x={x}
  //     y={y}
  //     tint={tint}
  //     width={tileWidth}
  //     height={tileHeight}
  //     interactive={interactive}
  //     hitArea={hitArea}
  //     pointerover={onPointerOver}
  //     pointerout={onPointerOut}
  //     pointertap={onClick}
  //   />
  // );
};

export default GridTile;
