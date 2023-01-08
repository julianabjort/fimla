import { observer } from "mobx-react-lite";

const SpellingBeeGrid = ({ store }) => {
  return (
    <div className="flex gap-x-0.5 md:gap-x-2">
      {store.letters.map((letter, i) => (
        <div
          className="flex w-12 text-2xl capitalize cursor-pointer md:text-4xl md:w-24 bg-lighter dark:bg-dark rounded-xl aspect-square center"
          key={i}
        >
          {letter}
        </div>
      ))}
    </div>
  );
};

export default observer(SpellingBeeGrid);
