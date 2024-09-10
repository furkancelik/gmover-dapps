import { motion } from "framer-motion";

const IntroTextEffect = ({ story, delay = 0, className = "" }) => {
  const letters = Array.from(story);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.025, delayChildren: delay / 1000 },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.p
      variants={container}
      initial="hidden"
      animate="visible"
      className={`whitespace-pre-wrap w-full ${className}`}
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>
          {letter}
        </motion.span>
      ))}
    </motion.p>
  );
};

export default IntroTextEffect;
