import { motion } from "framer-motion";

const NeonCircle = ({ delay = 0 }) => (
  <motion.div
    className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-30"
    animate={{
      scale: [1, 2, 2, 1, 1],
      x: [0, 100, -100, -100, 0],
      y: [0, -100, 100, -100, 0],
      backgroundColor: [
        "rgba(76, 0, 255, 0.3)",
        "rgba(0, 255, 117, 0.3)",
        "rgba(255, 0, 0, 0.3)",
        "rgba(0, 255, 255, 0.3)",
        "rgba(76, 0, 255, 0.3)",
      ],
    }}
    transition={{
      duration: 20,
      ease: "easeInOut",
      times: [0, 0.2, 0.5, 0.8, 1],
      repeat: Infinity,
      repeatType: "reverse",
      delay,
    }}
    style={{
      width: "300px",
      height: "300px",
    }}
  />
);

export default NeonCircle;
