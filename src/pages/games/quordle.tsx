import React from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import Keyboard2 from "../../components/Keyboard2";
import QuordleGrid from "../../components/QuordleGrid";
import QuordleStore from "../../stores/QuordleStore";

const quordle = () => {
  const store = useLocalObservable(() => QuordleStore);
  useEffect(() => {
    store.init()
    window.addEventListener('keyup', store.handleKeyup)
    return () => {
      window.removeEventListener('keyup', store.handleKeyup)
    }
  }, [])
// console.log("won ? ", store.win1, store.win2,store.win3,store.win4, "WIN ? ", store.win, store.won)
  return (
    <div className="flex flex-col items-center my-10 justify-evenly">
      <h1 className="heading-1">Quordle</h1>
      <div className="flex flex-col items-center my-10 justify-evenly">
        <div className="grid grid-cols-2 gap-4">
          <div>
            {store.guesses.map((_, i) => {
            if (store.guesses[i] === store.word1 && i < store.currentGuess) {
            // console.log("Got it")

            // 1. Disable this quordle grid
            
          }

            return (
                <QuordleGrid
                key={i}
                word1={store.word1}
                guess={store.guesses[i]}
                isGuessed={i < store.currentGuess}
                won={store.win1}
                next={store.currentGuess}
              />
            )})}
            <h1>word1: {store.word1}</h1> {store.win1 && <h1>won 1</h1> }

          </div>
          <div>
            {store.guesses.map((_, i) => (
                <QuordleGrid
                key={i}
                word1={store.word2}
                guess={store.guesses[i]}
                isGuessed={i < store.currentGuess}
                won={store.win2}
                next={store.currentGuess}
              />
            ))}
            <h1>word2: {store.word2}</h1> {store.win2 && <h1>won 2</h1> }

          </div>
          <div>
            {store.guesses.map((_, i) => (
              <QuordleGrid
              key={i}
              word1={store.word3}
              guess={store.guesses[i]}
              isGuessed={i < store.currentGuess}
              won={store.win3}
              next={store.currentGuess}
            />
            ))}      
            <h1>word3: {store.word3}</h1> {store.win3 && <h1>won 3</h1> }

          </div>
          <div>
            {store.guesses.map((_, i) => (
              <QuordleGrid
              key={i}
              word1={store.word4}
              guess={store.guesses[i]}
              isGuessed={i < store.currentGuess}
              won={store.win4}
              next={store.currentGuess}
            />
            ))}
            <h1>word4: {store.word4}</h1> {store.win4 && <h1>won 4</h1> }

          </div>
        </div>
      </div>
      <Keyboard2 store={store} />
      {store.win === true && <h1>You Won</h1> }
      {store.lost && <h1>You Lost</h1> }
      <button onClick={store.calculateScore}>Save</button>
      <h1>guesses: {JSON.stringify(store.guesses)}</h1>
      <h1>guesses: {JSON.stringify(store.currentGuess)}</h1>
    </div>
  )
};

export default observer(quordle);
