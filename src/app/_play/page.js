"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Container, Sprite, Graphics } from "@pixi/react";
import { Texture, SCALE_MODES, Polygon } from "pixi.js";

const IsometricGrid = ({ gridSize = 2, tileWidth = 128 }) => {
  const [texture, setTexture] = useState(null);
  const [hoveredTile, setHoveredTile] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null); // Seçilen karenin durumu

  useEffect(() => {
    // Görselin yüklenmesi
    const texture = Texture.from("/b3.png", {
      scaleMode: SCALE_MODES.NEAREST,
    });
    setTexture(texture);
  }, []);

  if (!texture) {
    return null; // Texture yüklenirken boş render edilir
  }

  const tileHeight = tileWidth / 1.2; // İzometrik kare için height, width'in uyarlanmış hali

  const tiles = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      console.log(x, y);
      const tileX = (x - y) * (tileWidth / 2);
      const tileY = (x + y) * (tileHeight / 3.5);

      const isHovered =
        hoveredTile && hoveredTile.x === x && hoveredTile.y === y;
      const tileColor = isHovered ? 0xbbbbbb : 0xffffff;

      // Hit area tanımlama (elmas şeklinde) - oranlar güncellendi
      const hitArea = new Polygon([
        0,
        -tileHeight / 1.8, // Üst orta
        tileWidth / 2,
        0, // Sağ orta
        0,
        tileHeight / 1, // Alt orta
        -tileWidth / 2,
        0, // Sol orta
      ]);

      tiles.push(
        <Sprite
          key={`${x}-${y}`}
          texture={texture}
          x={tileX + window.innerWidth / 2}
          y={tileY + window.innerHeight / 2 - 100}
          anchor={0.5}
          interactive={true}
          width={tileWidth}
          height={tileHeight} // İzometrik görünüm için height'i ayarlıyoruz
          pointerover={() => setHoveredTile({ x, y })}
          pointerout={() => setHoveredTile(null)}
          pointerdown={() => setSelectedTile({ x, y })} // Kareye tıklandığında seçilir
          tint={tileColor} // Vurgulama rengi
          hitArea={hitArea} // Özel hit area
        />
      );
    }
  }

  return <Container>{tiles}</Container>;
};

export default function Home() {
  const [play, setPlay] = useState(false);
  const ref = useRef();
  useEffect(() => {
    if (play) {
      setTimeout(() => {
        ref.current.app.renderer.backgroundColor = "#bbf1fd";
      }, 100);
    }
  }, [play]);
  return (
    <div className={` bg-black`}>
      <button
        onClick={() => {
          setPlay(true);
        }}
        className=" absolute left-0 top-0 p-5 text-white"
      >
        PLAY
      </button>
      <div
        className={`${
          play
            ? "size-20 opacity-100 -translate-y-32"
            : "size-14 opacity-0 translate-y-96"
        } rounded-full absolute top-10 right-1/4 z-20 bg-yellow-500 transition-all duration-[2000ms]`}
      ></div>
      <Stage
        ref={ref}
        renderOnComponentChange={true}
        width={window.innerWidth}
        height={window.innerHeight}
        options={{
          resizeTo: window,
          background: "0x000000",
        }}
        className={`${
          play ? "scale-100 opacity-100" : "scale-75 opacity-30"
        }   transition-all  duration-[1000ms]`}
      >
        <IsometricGrid gridSize={6} />
      </Stage>
    </div>
  );
}
