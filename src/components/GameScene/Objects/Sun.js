import { Graphics } from "@pixi/react";
import { GlowFilter } from "@pixi/filter-glow";
import * as PIXI from "pixi.js";
import { useSpring, animated } from "react-spring";

const AnimatedGraphics = animated(Graphics);

const Sun = ({ scaleFactor, windowSize, playGame }) => {
  const { x, y, scale, opacity } = useSpring({
    from: {
      x: windowSize.width / 3 - (128 * scaleFactor) / 2,
      y: windowSize.height / 2,
      scale: 0.4,
      opacity: 0,
    },
    to: {
      x: windowSize.width / 3 - (128 * scaleFactor) / 2,
      y: (windowSize.height / 2 - 64 * 2.2 * scaleFactor - 40) * -1,
      scale: 1,
      opacity: 1,
    },
    config: { tension: 100, friction: 40 },
    pause: !playGame,
  });

  const drawSun = (g) => {
    g.clear();

    // Outer glow
    g.beginFill(0xffff00, 0.5); // Sarı renkte yarı şeffaf bir ışık halesi
    g.drawCircle(0, 0, 70); // Hale için daha büyük bir çember
    g.endFill();

    // Inner sun
    g.beginFill(0xffd700); // Parlak sarı renk
    g.drawCircle(0, 0, 40); // Güneş için daha küçük bir çember
    g.endFill();
  };

  return (
    <AnimatedGraphics
      draw={drawSun}
      x={x}
      y={y}
      scale={scale} // scale animasyonu
      alpha={opacity} // opacity animasyonu
      filters={[
        new GlowFilter({
          distance: 30, // Daha düşük bir mesafe seçildi
          outerStrength: 3, // Hafifçe artırılmış dış parlaklık
          innerStrength: 1, // İç parlaklık
          color: 0xffff00,
        }),
      ]} // Glow efekti
    />
  );
};

export default Sun;

// import { Graphics } from "@pixi/react";
// import { GlowFilter } from "@pixi/filter-glow";
// import * as PIXI from "pixi.js";

// import { useSpring, animated } from "react-spring";

// const AnimatedGraphics = animated(Graphics);

// const Sun = ({ playGame, scaleFactor, windowSize }) => {
//   // useSpring ile başlangıç ve bitiş pozisyonlarını tanımlıyoruz
//   const { x, y } = useSpring({
//     from: {
//       x: windowSize.width / 2, // Başlangıçta sahnenin ortasında
//       y: windowSize.height / 2,
//     },
//     to: {
//       x: windowSize.width / 3 - (128 * scaleFactor) / 2, // Son konumu
//       y: (windowSize.height / 2 - 64 * 2.2 * scaleFactor - 40) * -1,
//     },
//     config: { tension: 200, friction: 15 },
//     pause: !playGame, // playGame false ise animasyon durur
//   });

//   const drawSun = (g) => {
//     g.clear();

//     // Outer glow
//     g.beginFill(0xffff00, 0.5); // Sarı renkte yarı şeffaf bir ışık halesi
//     g.drawCircle(0, 0, 70); // Hale için daha büyük bir çember
//     g.endFill();

//     // Inner sun
//     g.beginFill(0xffd700); // Parlak sarı renk
//     g.drawCircle(0, 0, 40); // Güneş için daha küçük bir çember
//     g.endFill();
//   };

//   return (
//     <AnimatedGraphics
//       draw={drawSun}
//       x={x} // Animasyonlu X pozisyonu
//       y={y} // Animasyonlu Y pozisyonu
//       filters={[
//         new GlowFilter({
//           distance: 30,
//           outerStrength: 3,
//           innerStrength: 1,
//           color: 0xffff00,
//         }),
//       ]}
//     />
//   );
// };

// export default Sun;
