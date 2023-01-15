import Link from "next/link";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import WordGrid from "../../components/WordGrid";
import Keyboard from "../../components/Keyboard";
import WordleStore from "../../stores/WordleStore.jsx";
import OnboardingModal from "../../components/OnboardingModal";
import getByUserEmail from "../../../lib/getByUserEmail";
import updateData from "../../../lib/updateData";
import LoadingIcon from "../../components/LoadingIcon";

const Wordle = () => {
  const { data: session, status } = useSession();
  const userSession = session?.user;
  const user = session?.user?.email;
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

  const getStats = async () =>
    getByUserEmail("wordle-stats", userSession).then((result) =>
      setStats(result[0])
    );

  useEffect(() => {
    console.log(store.word);
    getStats();
  }, [session]);

  const addWordleStats = async () => {
    if (session) {
      let wins = 0;
      let losses = 0;
      let totalScore = 0;

      if (stats) {
        totalScore = stats.totalScore + store.totalScore;
        if (store.won) {
          wins = stats.wins + 1;
          losses = stats.losses;
        }
        if (store.lost) {
          losses = stats.losses + 1;
          wins = stats.wins;
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
      if (stats) {
        updateData("wordle-stats", "PUT", body);
      } else {
        updateData("wordle-stats", "POST", body);
      }
    }
  };
  useEffect(() => {
    if (store.won || store.lost) {
      addWordleStats();
    }
  }, [store.roundComplete]);

  if (status === "loading") return <LoadingIcon isPage />;

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
      <div className="flex items-center justify-between w-full border-b-2">
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
