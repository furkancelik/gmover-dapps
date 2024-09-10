import DryTile from "../Objects/DryTile";
import GrassTile from "../Objects/GrassTile";

const GridTile = ({ row, col, tileType, interactive, onClick }) => {
  if (tileType === "dry") {
    return (
      <DryTile
        row={row}
        col={col}
        interactive={interactive}
        onClick={onClick}
      />
    );
  } else if (tileType === "grass") {
    return (
      <GrassTile
        row={row}
        col={col}
        interactive={interactive}
        onClick={onClick}
      />
    );
  }
  return null;
};

export default GridTile;
