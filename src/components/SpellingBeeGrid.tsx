import { observer } from "mobx-react-lite";
import { motion } from "framer-motion";

const SpellingBeeGrid = ({ store }) => {
  return (
    <div className="flex gap-x-0.5 md:gap-x-2">
      {store.letters.map((letter, i) => (
        <motion.div
          animate={{ scaleY: [0, 1] }}
          transition={{ type: "tween", duration: 0.5, delay: 1 + i / 4 }}
          className="flex w-12 text-2xl capitalize cursor-pointer md:text-4xl md:w-24 bg-lighter dark:bg-dark rounded-xl aspect-square center"
          key={i}
        >
          {letter}
        </motion.div>
      ))}
    </div>
  );
};

export default observer(SpellingBeeGrid);
