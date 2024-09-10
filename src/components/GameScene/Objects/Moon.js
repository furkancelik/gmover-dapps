import { useState, useEffect } from "react";
import { Sprite } from "@pixi/react";
import { GlowFilter } from "@pixi/filter-glow";
import { useSpring, animated } from "react-spring";
import * as PIXI from "pixi.js";
import { TILE_WIDTH } from "@/constants/grid";

const AnimatedSprite = animated(Sprite);

const Moon = ({ scaleFactor, windowSize, playGame }) => {
  const [moonTexture, setMoonTexture] = useState(null);

  useEffect(() => {
    const texture = PIXI.Texture.from("/moon-smal.png");
    setMoonTexture(texture);
  }, []);

  const { x, y, scale, opacity } = useSpring({
    from: {
      x: windowSize.width / 3 - (128 * scaleFactor) / 2,
      y: (windowSize.height / 2 - 64 * scaleFactor) * -1,
      scale: 1,
      opacity: 1,
    },
    to: {
      x: windowSize.width / 3 - (128 * scaleFactor) / 2,
      y: windowSize.height,
      scale: 0.2,
      opacity: 0,
    },
    config: { tension: 150, friction: 50 },
    pause: !playGame,
  });

  return moonTexture ? (
    <AnimatedSprite
      texture={moonTexture} // State üzerinden yüklenen texture
      x={x}
      y={y}
      width={300}
      height={300}
      scale={scale}
      alpha={opacity}
      // filters={[
      //   new GlowFilter({
      //     distance: 30,
      //     outerStrength: 2,
      //     innerStrength: 1,
      //     color: 0xb0c4de, // Ay ışığını taklit eden bir renk
      //   }),
      // ]}
    />
  ) : null; // Eğer texture henüz yüklenmediyse, hiçbir şey render edilmez
};

export default Moon;
