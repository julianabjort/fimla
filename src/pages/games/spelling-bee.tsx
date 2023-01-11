import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState, useRef } from "react";
import { HiRefresh, HiX } from "react-icons/hi";
import { useSession } from "next-auth/react";
import Link from "next/link";

import SpellingBeeStore from "../../stores/SpellingBeeStore.jsx";
import SpellingBeeGrid from "../../components/SpellingBeeGrid";
import OnboardingModal from "../../components/OnboardingModal";
import ProgressBar from "../../components/ProgressBar";
import getUserStats from "../../../lib/getUserStats";
import updateData from "../../../lib/updateData";

const SpellingBee = () => {
  const { data: session } = useSession();
  const user = session?.user?.email;
  const userSession = session?.user;
  const ref = useRef(null);
  const store = useLocalObservable(() => SpellingBeeStore);
  const [word, setWord] = useState("");
  const [onboardingModal, setOnboardingModal] = useState(false);
  const [beeVisited, setBeeVisited] = useState(true);
  const [stats, setStats] = useState({ user, totalScore: 0 });
  const [hintsModal, setHintsModal] = useState(false);
  const fourLetterHints: string[][] = store.fourLetterHints;
  const fiveLetterHints: string[][] = store.fiveLetterHints;

  useEffect(() => {
    store.startGame();
    window.addEventListener("keydown", store.handleKeydown);
    return () => {
      window.removeEventListener("keydown", store.handleKeydown);
    };
  }, []);
  useEffect(() => {
    focusInput();
    window.addEventListener("keydown", focusInput);
    return () => {
      window.removeEventListener("keydown", focusInput);
    };
  }, []);

  const focusInput = () => {
    const input = document.getElementById("sbInput");
    if (input) input.focus();
  };

  useEffect(() => {
    store.word = word;
  }, [word]);

  useEffect(() => {
    let beeVisited = JSON.parse(localStorage.getItem("beeVisited") || "false");
    if (!beeVisited) {
      beeVisited = true;
      localStorage.setItem("beeVisited", JSON.stringify(beeVisited));
      setBeeVisited(false);
    }
  }, []);
  useEffect(() => {
    if (!beeVisited) {
      setOnboardingModal(true);
    }
  }, [beeVisited]);

  const clearInput = (e: { key: string }) => {
    if (e.key === "Enter") {
      setWord("");
      store.error = "";
    }
  };
  const getStats = async () =>
    getUserStats("bee-stats", userSession).then((result) =>
      setStats(result[0])
    );
  useEffect(() => {
    getStats();
  }, [session]);

  const addBeeStats = async () => {
    let totalScore = {};
    if (session) {
      totalScore =
        stats.totalScore +
        store.fourLetterWords.length +
        store.fiveLetterWords.length * 2;
    } else {
      totalScore =
        store.fourLetterWords.length + store.fiveLetterWords.length * 2;
    }
    const body = { user, totalScore };

    if (stats) {
      updateData("bee-stats", "PUT", body);
    } else {
      updateData("bee-stats", "POST", body);
    }
  };

  return (
    <div className="flex flex-col items-center my-10 justify-evenly">
      {hintsModal || onboardingModal ? (
        <div className="fixed bottom-0 w-full h-full bg-black bg-opacity-75 "></div>
      ) : null}
      <div className="flex justify-center">
        {onboardingModal ? (
          <OnboardingModal
            title="How to play Spelling Bee"
            textOne="Find as many words as you can using the 7 letters given. Words must contain at least 4 letters. Letters can be used more than once. Our word list does not include words that are obscure, hyphenated, or proper nouns."
            textTwo="Points are given for each word, 4 letter words are worth 1 point, 5 letter words are worth 2 points and so on. Create an account to save your stats, it’s free!"
            image="/how-to-sb.png"
            alt="spellingbee"
            onClick={() => setOnboardingModal(false)}
          />
        ) : null}
      </div>
      <div className="flex flex-col justify-between w-full sm:items-center sm:border-b-2 sm:flex-row">
        <h1 className="pb-2 border-b-2 sm:border-b-0 heading-1">
          Spelling Bee
        </h1>
        <div className="flex cursor-pointer gap-x-6">
          <button onClick={() => setHintsModal(true)}>Hints</button>
          <Link href="/stats">Stats</Link>
          <button onClick={() => setOnboardingModal(true)}>How to play</button>
        </div>
      </div>
      {hintsModal ? (
        <div className="absolute flex flex-col p-10 rounded-xl bg-lightest dark:bg-dark">
          <div className="flex items-baseline justify-between mb-6">
            <div className="flex-col space-y-2">
              <h2 className="heading-2">Today's Hints</h2>
              <p>The numbers represent how many words start with each letter</p>
            </div>
            <button
              className="mb-5 text-center heading-1"
              onClick={() => setHintsModal(false)}
            >
              <HiX />
            </button>
          </div>
          <div className="flex gap-10 justify-evenly">
            <div className="flex flex-col text-center">
              <h3 className="heading-3">Four Letter Words</h3>
              {fourLetterHints.map((words, index) => (
                <p key={index}>
                  {store.letters[index]} - {words.length}
                </p>
              ))}
            </div>
            <div className="flex flex-col text-center">
              <h3 className="heading-3">Five Letter Words</h3>
              {fiveLetterHints.map((words, index) => (
                <p key={index}>
                  {store.letters[index]} - {words.length}
                </p>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <h1 className="h-10 p-2 rounded-md text-error">{store.error}</h1>
      <input
        ref={ref}
        id="sbInput"
        placeholder="Start typing.."
        className="w-full h-20 my-8 text-2xl text-center outline-none dark:bg-background"
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
        <button className="px-4 py-2 border rounded-xl">delete</button>
      </div>
      <div className="flex w-full md:w-3/4 gap-x-4">
        <div className="w-full px-10 py-6 h-80 rounded-xl bg-lightest dark:bg-dark">
          <div className="flex justify-between">
            <h1 className="heading-2 md:heading-1">Words</h1>

            <p>
              {store.allFoundWords.length} / {store.allWords.length}
            </p>
          </div>
          <ProgressBar progressPercentage={store.progressPercentage} />
          {store.allFoundWords.map((word, i) => (
            <div className="flex items-center my-1 gap-x-3" key={i}>
              <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
              {word}
            </div>
          ))}
        </div>
      </div>
      <button onClick={addBeeStats}>Save score & quit</button>
    </div>
  );
};

export default observer(SpellingBee);
