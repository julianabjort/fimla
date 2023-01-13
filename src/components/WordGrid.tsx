import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const WordGrid = ({
  word,
  guess,
  isGuessed,
}: {
  word: string;
  guess: string;
  isGuessed: boolean;
}) => {
  return (
    <div className="grid w-auto grid-cols-5">
      {new Array(5).fill(0).map((_, i) => {
        const bgColor = !isGuessed
          ? "bg-lighter dark:bg-dark"
          : guess[i] === word[i]
          ? "bg-green"
          : word.includes(guess[i])
          ? "bg-yellow"
          : "bg-lighter dark:bg-dark";
        return (
          <motion.div
            animate={{ scaleY: isGuessed ? [1, 0, 1] : 1 }}
            transition={{ type: "tween", duration: 0.5, delay: i / 2.2 }}
            key={i}
          >
            <div
              className={`flex w-12 mx-1 my-1 text-4xl capitalize rounded-md aspect-square transition duration-500 delay-delay${i} ${bgColor} center`}
            >
              {guess[i]}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default WordGrid;
