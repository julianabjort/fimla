import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import Guess from "../../components/Guess";
import Keyboard from "../../components/Keyboard";
import WordleStore from "../../stores/WordleStore";

const wordle = () => {
  const store = useLocalObservable(() => WordleStore);

  useEffect(() => {
    store.init();
    window.addEventListener("keyup", store.handleKeyup);
    return () => {
      window.removeEventListener("keyup", store.handleKeyup);
    };
  }, []);
  return (
    <div className="flex flex-col items-center my-20 justify-evenly">
      <h1 className="heading-1">Wordle</h1>
      {store.guesses.map((_, i) => (
        <Guess
          word={store.word}
          guess={store.guesses[i]}
          isGuessed={i < store.currentGuess}
          key={i}
        />
      ))}
      {store.won && <h1>You won!</h1>}
      {store.lost && <h1>You lost!</h1>}
      {(store.lost || store.won) && (
        <button onClick={store.init}>Play again</button>
      )}
      <Keyboard />
      <h1>word: {store.word}</h1>
      <h1>guesses: {JSON.stringify(store.guesses)}</h1>
    </div>
  );
};

export default observer(wordle);
