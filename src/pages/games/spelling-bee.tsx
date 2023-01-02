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
      <div className="flex items-center justify-between w-full border-b-2">
        <h1 className="pb-2 heading-1">Spelling Bee</h1>
        <div className="flex cursor-pointer gap-x-8">
          <p>today's hints</p>
          <p>yesterday's answers</p>
        </div>
      </div>
      <h1 className="h-10 p-2 rounded-md text-error">{store.error}</h1>
      <input
        placeholder="Type or click.."
        className="w-full h-20 my-10 text-2xl text-center outline-none dark:bg-background"
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        onKeyUp={clearInput}
      />
      <SpellingBeeGrid store={store} />
      <div className="flex my-10 gap-x-6">
        <button
          onClick={store.submitWord}
          className="px-4 py-2 border rounded-xl"
        >
          enter
        </button>
        <button
          className="px-3 py-2 border rounded-full"
          onClick={() => store.shuffle(store.letters)}
        >
          <HiRefresh />
        </button>
        <button
          onClick={store.handleDelete}
          className="px-4 py-2 border rounded-xl"
        >
          delete
        </button>
      </div>
      <div className="flex w-full gap-x-4">
        <div className="w-full h-56 p-4 rounded-xl bg-lightest dark:bg-dark">
          <div className="flex justify-between">
            <h2 className="heading-3">4 letter words</h2>
            <p>
              {store.fourLetterWords.length} / {store.allFourLetterWords.length}
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
              {store.fiveLetterWords.length} / {store.allFiveLetterWords.length}
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
              {store.sixLetterWords.length} / {store.allSixLetterWords.length}
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
