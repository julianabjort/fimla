import React from "react";
import { motion } from "framer-motion";

const LoadingIcon = () => {
  const loadingContainerVariants = {
    start: {
      transition: {
        staggerChildren: 0.3,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const loadingCircleVariants = {
    start: {
      y: "50%",
    },
    end: {
      y: "150%",
    },
  };

  return (
    <div className="flex w-full h-[50vh] center">
      <motion.div
        variants={loadingContainerVariants}
        initial="false"
        animate="end"
        className="flex space-x-2"
      >
        <motion.span
          variants={loadingCircleVariants}
          transition={{
            duration: 0.5,
            repeatType: "mirror",
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-4 h-4 bg-purple-400 rounded-full"
        />
        <motion.span
          variants={loadingCircleVariants}
          transition={{
            duration: 0.5,
            repeatType: "mirror",
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-4 h-4 bg-purple-400 rounded-full"
        />
        <motion.span
          variants={loadingCircleVariants}
          transition={{
            duration: 0.5,
            repeatType: "mirror",
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-4 h-4 bg-purple-400 rounded-full"
        />
      </motion.div>
    </div>
  );
};

export default LoadingIcon;
