import { useState } from "react";
import { motion } from "framer-motion";

const ProgressBar = ({ progressPercentage }) => {
  return (
    <div className="w-full h-8 my-4 bg-white rounded-lg dark:bg-light">
      <motion.div
        animate={{ width: `${progressPercentage}%` }}
        transition={{ type: "tween", duration: 0.5 }}
        className="h-full bg-purple-400 rounded-l-lg"
      ></motion.div>
    </div>
  );
};

export default ProgressBar;
