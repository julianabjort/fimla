import React from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState } from "react";
import Keyboard2 from "../../components/Keyboard2";
import QuordleGrid from "../../components/QuordleGrid";
import QuordleStore from "../../stores/QuordleStore.jsx";
import OnboardingModal from "../../components/OnboardingModal";
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
  const [onboardingModal, setOnboardingModal] = useState(false);
  const [quordleVisited, setQuordleVisited] = useState(true);
  useEffect(() => {
    store.init();
    window.addEventListener("keyup", store.handleKeyup);
    return () => {
      window.removeEventListener("keyup", store.handleKeyup);
    };
  }, []);
  useEffect(() => {
    let quordleVisited = JSON.parse(
      localStorage.getItem("quordleVisited") || "false"
    );
    if (!quordleVisited) {
      setQuordleVisited(false);
      quordleVisited = true;
      localStorage.setItem("quordleVisited", JSON.stringify(quordleVisited));
    }
  }, []);
  useEffect(() => {
    if (!quordleVisited) {
      setOnboardingModal(true);
    }
  }, [quordleVisited]);

  const readQuordleStats = async () => {
    if (session) {
      console.log("sess");
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
    readQuordleStats();
    if (session) {
      const user = session?.user?.email;
      let wins = 0;
      let losses = 0;
      let totalScore = 0;
      if (qStats[0]) {
        const userStats = qStats[0];
        totalScore = userStats.totalScore + store.totalScore;
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
  useEffect(() => {
    if (store.roundComplete) {
      addQuordleStats();
    }
  }, [store.roundComplete]);
  return (
    <div className="flex flex-col items-center my-10 justify-evenly">
      <div className="flex justify-center">
        {onboardingModal ? (
          <OnboardingModal
            title="How to play Quordle"
            textOne="Try to guess 4 words in 9 tries. Each guess applies to the four different words you need to solve. After each guess, the color of the tiles will change to show how close your guess was to the word."
            textTwo="The letter H is in the word and in the correct spot. The letter O is in the word but in the wrong spot."
            image="/how-to-play.png"
            alt="wordle-letters"
            onClick={() => setOnboardingModal(false)}
          />
        ) : null}
      </div>
      <div className="flex items-center justify-between w-full border-b-2">
        <h1 className="pb-2 heading-1">Quordle</h1>
        <div className="flex cursor-pointer gap-x-6">
          <button>Stats</button>
          <button onClick={() => setOnboardingModal(true)}>How to play</button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-evenly">
        <h1 className="h-6 px-2 rounded-md text-error">{store.error}</h1>
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
    </div>
  );
};

export default observer(Quordle);
