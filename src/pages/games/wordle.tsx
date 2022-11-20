import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import WordGrid from "../../components/WordGrid";
import Keyboard from "../../components/Keyboard";
import WordleStore from "../../stores/WordleStore";

const wordle = () => {
  const store = useLocalObservable(() => WordleStore);

  useEffect(() => {
    store.startGame();
    window.addEventListener("keyup", store.handleKeyup);
    return () => {
      window.removeEventListener("keyup", store.handleKeyup);
    };
  }, []);

  return (
    <div className="flex flex-col items-center my-10 justify-evenly">
      <h1 className="heading-1">Wordle</h1>
      <h1 className="h-6 px-2 rounded-md text-error">{store.error}</h1>
      {store.guesses.map((_, i) => (
        <WordGrid
          word={store.word}
          guess={store.guesses[i]}
          isGuessed={i < store.numberOfGuesses}
          key={i}
        />
      ))}
      {store.won && <h1>You won!</h1>}
      {store.lost && <h1>You lost!</h1>}
      {(store.lost || store.won) && (
        <button onClick={store.startGame}>Play again</button>
      )}
      <Keyboard store={store} />
      <button onClick={store.calculateScore}>Save</button>
      <h1>word: {store.word}</h1>
      <h1>guesses: {JSON.stringify(store.guesses)}</h1>
      <h1>numberOfGuesses: {store.numberOfGuesses}</h1>
    </div>
  );
};

export default observer(wordle);
