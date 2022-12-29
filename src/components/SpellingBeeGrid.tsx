import { observer } from "mobx-react-lite";

const SpellingBeeGrid = ({ store }) => {
  return (
    <div className="flex gap-x-4">
      {store.letters.map((letter, i) => (
        <div
          className="flex w-24 text-4xl border border-dark dark:border-white rounded-xl aspect-square center"
          key={i}
        >
          {letter}
        </div>
      ))}
    </div>
  );
};

export default observer(SpellingBeeGrid);
