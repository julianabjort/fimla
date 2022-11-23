import { useEffect, useState } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import SpellingBeeStore from "../../stores/SpellingBeeStore";
import SpellingBeeGrid from "../../components/SpellingBeeGrid";

const spellingBee = () => {
  const store = useLocalObservable(() => SpellingBeeStore);
  // useEffect(() => {
  //   store.startGame();
  // }, []);

  return (
    <div className="flex flex-col items-center my-10 justify-evenly">
      <SpellingBeeGrid letters={store.letters} />
      <button
        className="p-2 m-2 text-black bg-white rounded-md"
        onClick={store.startGame}
      >
        refresh
      </button>
    </div>
  );
};

export default observer(spellingBee);
