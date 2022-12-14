import React from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import Keyboard2 from "../../components/Keyboard2";
import QuordleGrid from "../../components/QuordleGrid";
import QuordleStore from "../../stores/QuordleStore";
import play from "../play";
import { HiMenuAlt1 } from "react-icons/hi";

const quordle = () => {
  const store = useLocalObservable(() => QuordleStore);
  useEffect(() => {
    store.init();
    window.addEventListener("keyup", store.handleKeyup);
    return () => {
      window.removeEventListener("keyup", store.handleKeyup);
    };
  }, []);
  // console.log("won ? ", store.win1, store.win2,store.win3,store.win4, "WIN ? ", store.win, store.won)
  return (
    <div className="flex flex-col items-center my-10 justify-evenly">
      <h1 className="heading-1">Quordle</h1>
      <div className="flex flex-col items-center justify-evenly">
        <div className="grid grid-cols-2 gap-4 my-4">
          <div>
            {store.guesses.map((_, i) => (
              <QuordleGrid
                key={i}
                word1={store.word1}
                guess={store.guesses[i]}
                isGuessed={i < store.currentGuess}
                won={store.won1}
              />
            ))}
          </div>
          <div>
            {store.guesses2.map((_, i) => (
              <QuordleGrid
                key={i}
                word1={store.word2}
                guess={store.guesses2[i]}
                isGuessed={i < store.currentGuess2}
                won={store.won2}
              />
            ))}
          </div>
          <div>
            {store.guesses3.map((_, i) => (
              <QuordleGrid
                key={i}
                word1={store.word3}
                guess={store.guesses3[i]}
                isGuessed={i < store.currentGuess3}
                won={store.won3}
              />
            ))}
          </div>
          <div>
            {store.guesses4.map((_, i) => (
              <QuordleGrid
                key={i}
                word1={store.word4}
                guess={store.guesses4[i]}
                isGuessed={i < store.currentGuess4}
                won={store.won4}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        {store.wonAll && (
          <h1 className="text-xl font-bold text-green">You Won! Good job!</h1>
        )}
        {store.lost && (
          <div className="flex items-center my-2 gap-x-8">
            <p className="text-lg font-bold">Almost! correct words:</p>
            <div>
              <p className="text-lg font-bold text-green">
                {store.word1} - {store.word2}
              </p>
              <p className="text-lg font-bold text-green">
                {store.word3} - {store.word4}
              </p>
            </div>
          </div>
        )}
      </div>
      <Keyboard2 store={store} />
      {/* <h1>word1: {store.word1}</h1>
      <h1>word2: {store.word2}</h1>
      <h1>word3: {store.word3}</h1>
      <h1>word4: {store.word4}</h1> */}

      {/* <button onClick={store.calculateScore}>Save</button>
      <h1>guesses: {JSON.stringify(store.guesses)}</h1>
      <h1>guesses2: {JSON.stringify(store.guesses2)}</h1>
      <h1>currentGuess: {JSON.stringify(store.currentGuess)}</h1>
      <h1>currentGuesses2: {JSON.stringify(store.currentGuess2)}</h1>
      <h1>all guessed letters: {JSON.stringify(store.correctLetters)}</h1> */}
    </div>
  );
};

export default observer(quordle);
