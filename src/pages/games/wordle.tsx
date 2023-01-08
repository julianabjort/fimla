import React from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState } from "react";
import WordGrid from "../../components/WordGrid";
import Keyboard from "../../components/Keyboard";
import WordleStore from "../../stores/WordleStore.jsx";
import { useSession } from "next-auth/react";
import OnboardingModal from "../../components/OnboardingModal";
import Link from "next/link";

const Wordle = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    totalScore: 0,
    gamesPlayed: 0,
    avgScore: 0,
  });
  const store = useLocalObservable(() => WordleStore);
  const [onboardingModal, setOnboardingModal] = useState(false);
  const [wordleVisited, setWordleVisited] = useState(true);

  useEffect(() => {
    store.startGame();
    window.addEventListener("keyup", store.handleKeyup);
    return () => {
      window.removeEventListener("keyup", store.handleKeyup);
    };
  }, []);

  useEffect(() => {
    let wordleVisited = JSON.parse(
      localStorage.getItem("wordleVisited") || "false"
    );
    if (!wordleVisited) {
      wordleVisited = true;
      localStorage.setItem("wordleVisited", JSON.stringify(wordleVisited));
      setWordleVisited(false);
    }
  }, []);
  useEffect(() => {
    if (!wordleVisited) {
      setOnboardingModal(true);
    }
  }, [wordleVisited]);

  const readWordleStats = async () => {
    if (session) {
      const userSession = session?.user;
      try {
        const response = await fetch(`/api/wordle-stats`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const allStats = await response.json();
        const myStats = allStats.filter(
          (i: { userEmail: string | null | undefined }) =>
            i.userEmail === userSession?.email
        );
        setStats(myStats);
        return myStats;
      } catch (error) {
        console.log("error: ", error);
      }
    } else {
      console.log("no session");
    }
  };

  useEffect(() => {
    readWordleStats();
  }, [session]);

  const addWordleStats = async () => {
    readWordleStats();
    if (session) {
      const user = session?.user?.email;
      let wins = 0;
      let losses = 0;
      let totalScore = 0;
      if (stats[0]) {
        const userStats = stats[0];
        totalScore = userStats.totalScore + store.totalScore;
        if (store.won) {
          wins = userStats.wins + 1;
        }
        if (store.lost) {
          losses = userStats.losses + 1;
        }
      } else {
        totalScore = store.totalScore;
        if (store.won) {
          wins = 1;
        }
        if (store.lost) {
          losses = 1;
        }
      }
      const body = { user, totalScore, wins, losses };
      if (stats[0]) {
        try {
          const response = await fetch(`/api/wordle-stats`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        } catch (error) {
          console.log("error: ", error);
        }
      } else {
        try {
          const response = await fetch(`/api/wordle-stats`, {
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
  useEffect(() => {
    if (store.won || store.lost) {
      addWordleStats();
    }
  }, [store.roundComplete]);

  return (
    <div className="flex flex-col items-center my-10 justify-evenly">
      <div className="flex justify-center">
        {onboardingModal ? (
          <OnboardingModal
            title="How to play Wordle"
            textOne="Try to guess the word in 6 tries. After each guess, the color of the tiles will change to show how close your guess was to the word."
            textTwo="The letter H is in the word and in the correct spot. The letter O is in the word but in the wrong spot."
            image="/how-to-play.png"
            alt="wordle-letters"
            onClick={() => setOnboardingModal(false)}
          />
        ) : null}
      </div>
      <div className="flex items-center justify-between w-full border-b border-b-black dark:border-b-white">
        <h1 className="pb-2 heading-1">Wordle</h1>
        <div className="flex cursor-pointer gap-x-6">
          <Link href="/stats">Stats</Link>
          <button onClick={() => setOnboardingModal(true)}>How to play</button>
        </div>
      </div>
      <h1 className="flex items-center h-10 px-2 rounded-md text-error">
        {store.error}
      </h1>
      {store.guesses.map((_, i) => (
        <WordGrid
          word={store.word}
          guess={store.guesses[i]}
          isGuessed={i < store.numberOfGuesses}
          key={i}
        />
      ))}
      {store.won && (
        <h1 className="text-lg font-bold">You won! You are good!</h1>
      )}
      {store.lost && (
        <div className="flex items-center my-2 gap-x-8">
          <p className="text-lg font-bold">Almost! The correct word was:</p>
          <div>
            <p className="text-lg font-bold text-green">{store.word}</p>
          </div>
        </div>
      )}
      {(store.lost || store.won) && (
        <>
          <button className="mt-2 btn-primary" onClick={store.startGame}>
            Play again
          </button>
        </>
      )}
      <Keyboard store={store} />
    </div>
  );
};

export default observer(Wordle);
