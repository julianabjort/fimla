import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";

const Animate = () => {
  const [move, setMove] = useState(false);
  return (
    <div className="flex m-10 space-x-4 center">
      <motion.div
        animate={{ scaleY: move ? [1, 0, 1] : 1 }}
        transition={{ type: "tween", duration: 0.5 }}
        className="flex w-20 h-20 text-xl font-bold bg-purple-300 rounded-md cursor-pointer center"
      >
        W
      </motion.div>
      <motion.div
        animate={{ scaleY: move ? [1, 0, 1] : 1 }}
        transition={{ type: "tween", duration: 0.5, delay: 0.5 }}
        className="flex w-20 h-20 text-xl font-bold bg-purple-300 rounded-md cursor-pointer center"
      >
        O
      </motion.div>
      <motion.div
        animate={{ scaleY: move ? [1, 0, 1] : 1 }}
        transition={{ type: "tween", duration: 0.5, delay: 1 }}
        className="flex w-20 h-20 text-xl font-bold bg-purple-300 rounded-md cursor-pointer center"
      >
        R
      </motion.div>
      <motion.div
        animate={{ scaleY: move ? [1, 0, 1] : 1 }}
        transition={{ type: "tween", duration: 0.5, delay: 1.5 }}
        className="flex w-20 h-20 text-xl font-bold bg-purple-300 rounded-md cursor-pointer center"
      >
        D
      </motion.div>
      <motion.div
        animate={{ scaleY: move ? [1, 0, 1] : 1 }}
        transition={{ type: "tween", duration: 0.5, delay: 2 }}
        className="flex w-20 h-20 text-xl font-bold bg-purple-300 rounded-md cursor-pointer center"
      >
        L
      </motion.div>
      <button
        onClick={() => {
          setMove(!move);
        }}
      >
        Start animation
      </button>
    </div>
  );
};

export default Animate;
