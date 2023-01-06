import { useEffect, useState, useRef } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import SpellingBeeStore from "../../stores/SpellingBeeStore.jsx";
import SpellingBeeGrid from "../../components/SpellingBeeGrid";
import OnboardingModal from "../../components/OnboardingModal";
import { HiRefresh, HiX } from "react-icons/hi";
import { useSession } from "next-auth/react";
import ProgressBar from "../../components/ProgressBar";

const SpellingBee = () => {
  const { data: session } = useSession();
  const ref = useRef(null);
  const store = useLocalObservable(() => SpellingBeeStore);
  const [word, setWord] = useState("");
  const [hints, setHints] = useState(false);
  const [onboardingModal, setOnboardingModal] = useState(false);
  const [beeVisited, setBeeVisited] = useState(true);
  const [stats, setStats] = useState({
    totalScore: 0,
  });

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
    console.log(store.progressPercentage);
  }, [store.progressPercentage]);

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
  const readBeeStats = async () => {
    if (session) {
      const userSession = session?.user;
      try {
        const response = await fetch(`/api/bee-stats`, {
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
    readBeeStats();
  }, [session]);

  const addBeeStats = async () => {
    readBeeStats();
    if (session) {
      const user = session?.user?.email;
      let totalScore = 0;
      if (stats[0]) {
        const userStats = stats[0];
        totalScore =
          userStats.totalScore +
          store.fourLetterWords.length +
          store.fiveLetterWords.length * 2;
      } else {
        totalScore =
          store.fourLetterWords.length + store.fiveLetterWords.length * 2;
      }
      const body = { user, totalScore };
      if (stats[0]) {
        try {
          const response = await fetch(`/api/bee-stats`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        } catch (error) {
          console.log("error: ", error);
        }
      } else {
        try {
          const response = await fetch(`/api/bee-stats`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
        } catch (error) {
          console.log("error: ", error);
        }
      }
    } else {
      console.log("no session");
    }
  };

  const filteredWords4: string[][] = [];
  const filteredWords5: string[][] = [];

  store.letters.forEach((letter, index) => {
    filteredWords4[index] = store.allFourLetterWords.filter((f) =>
      f.toLowerCase().startsWith(letter)
    );
    filteredWords5[index] = store.allFiveLetterWords.filter((f) =>
      f.toLowerCase().startsWith(letter)
    );
  });

  return (
    <div className="flex flex-col items-center my-10 justify-evenly">
      {hints || onboardingModal ? (
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
      <div className="flex items-center justify-between w-full border-b-2">
        <h1 className="pb-2 heading-1">Spelling Bee</h1>
        <div className="flex cursor-pointer gap-x-6">
          <button onClick={() => setHints(true)}>Hints</button>
          <p>Stats</p>
          <button onClick={() => setOnboardingModal(true)}>How to play</button>
        </div>
      </div>
      {hints ? (
        <div className="absolute flex flex-col p-10 rounded-xl bg-lightest dark:bg-dark">
          <div className="flex items-baseline justify-between mb-6">
            <h1 className="heading-1">Today's Hints</h1>
            <button
              className="mb-5 text-center heading-1"
              onClick={() => setHints(false)}
            >
              <HiX />
            </button>
          </div>
          <div className="flex gap-10 justify-evenly">
            <div className="flex flex-col text-center">
              <h2 className="heading-2">Four Letter Words</h2>
              {filteredWords4.map((words, index) => (
                <p key={index}>
                  {store.letters[index]} - {words.length}
                </p>
              ))}
            </div>
            <div className="flex flex-col text-center">
              <h2 className="heading-2">Five Letter Words</h2>
              {filteredWords5.map((words, index) => (
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
      <div className="flex w-full gap-x-4">
        <div className="w-full px-10 py-6 h-80 rounded-xl bg-lightest dark:bg-dark">
          <div className="flex justify-between">
            <h1 className="heading-1">Words</h1>

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
      <button onClick={addBeeStats}>Click</button>
    </div>
  );
};

export default observer(SpellingBee);
