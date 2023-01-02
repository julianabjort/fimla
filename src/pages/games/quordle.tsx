import React from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState } from "react";
import Keyboard2 from "../../components/Keyboard2";
import QuordleGrid from "../../components/QuordleGrid";
import QuordleStore from "../../stores/QuordleStore.jsx";
import { useSession } from "next-auth/react";

const Quordle = () => {
  const { data: session } = useSession();
  const [qStats, setQstats] = useState({
    wins: 0,
    losses: 0,
    totalScore: 0,
    gamesPlayed: 0,
    avgScore: 0,
  });
  const store = useLocalObservable(() => QuordleStore);

  useEffect(() => {
    store.init();
    window.addEventListener("keyup", store.handleKeyup);
    return () => {
      window.removeEventListener("keyup", store.handleKeyup);
    };
  }, []);

  const readQuordleStats = async () => {
    if (session) {
      const userSession = session?.user;
      try {
        const response = await fetch(`/api/quordle-stats`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const allStats = await response.json();
        const qStats = allStats.filter(
          (i: { userEmail: string | null | undefined }) =>
            i.userEmail === userSession?.email
        );
        setQstats(qStats);
        console.log("my stats: ", qStats);
        console.log("stats: ", qStats);
        return qStats;
      } catch (error) {
        console.log("error: ", error);
      }
    } else {
      console.log("no session");
    }
  };

  useEffect(() => {
    readQuordleStats();
  }, [session]);

  const addQuordleStats = async () => {
    console.log(qStats);
    readQuordleStats();
    if (session) {
      const user = session?.user?.email;
      let wins = 0;
      let losses = 0;
      let totalScore = 0;
      if (qStats[0]) {
        const userStats = qStats[0];
        totalScore = userStats.totalScore + store.totalScore;
        console.log("store: ", store.totalScore);
        if (store.wonAll) {
          wins = userStats.wins + 1;
        }
        if (store.lost) {
          losses = userStats.losses + 1;
        }
      } else {
        totalScore = store.totalScore;
        if (store.wonAll) {
          wins = 1;
        }
        if (store.lost) {
          losses = 1;
        }
      }
      const body = { user, totalScore, wins, losses };
      console.log("TOTAL: ", totalScore);
      if (qStats[0]) {
        try {
          const response = await fetch(`/api/quordle-stats`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        } catch (error) {
          console.log("error: ", error);
        }
      } else {
        try {
          const response = await fetch(`/api/quordle-stats`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        } catch (error) {
          console.log("error: ", error);
        }
      }
    }
  };

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
        {(store.lost || store.won) && (
          <>
            <button onClick={addQuordleStats}>Save your score!</button>
          </>
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

export default observer(Quordle);
