import { useEffect, useState } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import SpellingBeeStore from "../../stores/SpellingBeeStore";
import SpellingBeeGrid from "../../components/SpellingBeeGrid";
import { HiRefresh } from "react-icons/hi";

const spellingBee = () => {
  const store = useLocalObservable(() => SpellingBeeStore);
  const [word, setWord] = useState("");

  useEffect(() => {
    store.startGame();
    window.addEventListener("keydown", store.handleKeydown);
    return () => {
      window.removeEventListener("keydown", store.handleKeydown);
    };
  }, []);

  useEffect(() => {
    store.word = word;
  }, [word]);

  const clearInput = (e) => {
    if (e.key === "Enter") {
      setWord("");
      store.error = "";
    }
  };

  return (
    <div className="flex flex-col items-center my-20 justify-evenly">
      <h1 className="h-10 p-2 rounded-md text-error">{store.error}</h1>
      <div className="flex gap-x-6">
        <SpellingBeeGrid store={store} />
        <button onClick={() => store.shuffle(store.letters)}>
          <HiRefresh />
        </button>
      </div>

      <input
        placeholder="Type something.."
        className="w-full h-20 my-10 text-2xl text-center outline-none bg-lightest dark:bg-dark rounded-xl "
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        onKeyUp={clearInput}
      />
      <div className="flex w-full gap-x-4">
        <div className="w-full h-56 p-4 rounded-xl bg-lightest dark:bg-dark">
          <div className="flex justify-between">
            <h2 className="heading-3">4 letter words</h2>
            <p>
              {store.userFourLetterLength} / {store.allFourLetterLength}
            </p>
          </div>
          {store.fourLetterWords.map((word, i) => (
            <div key={i}>{word}</div>
          ))}
        </div>
        <div className="w-full h-56 p-4 rounded-xl bg-lightest dark:bg-dark">
          <div className="flex justify-between">
            <h2 className="heading-3">5 letter words</h2>
            <p>
              {store.userFiveLetterLength} / {store.allFiveLetterLength}
            </p>
          </div>
          {store.fiveLetterWords.map((word, i) => (
            <div key={i}>{word}</div>
          ))}
        </div>
        {/* <div className="w-full h-56 p-4 rounded-xl bg-dark">
          <div className="flex justify-between">
            <h2 className="heading-3">6 letter words</h2>
            <p>
              {store.userSixLetterLength} / {store.allSixLetterLength}
            </p>
          </div>
          {store.sixLetterWords.map((word, i) => (
            <div key={i}>{word}</div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default observer(spellingBee);
