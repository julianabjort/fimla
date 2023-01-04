import { useEffect, useState } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import SpellingBeeStore from "../../stores/SpellingBeeStore.jsx";
import SpellingBeeGrid from "../../components/SpellingBeeGrid";
import { HiRefresh, HiX } from "react-icons/hi";
import { useSession } from "next-auth/react";

const SpellingBee = () => {
  const { data: session } = useSession();
  const store = useLocalObservable(() => SpellingBeeStore);
  const [word, setWord] = useState("");
  const [hints, setHints] = useState(false);
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
    store.word = word;
  }, [word]);

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
    <div className="flex flex-col items-center my-20 justify-evenly">
      {hints ? (
        <div className="bg-black bg-opacity-75 w-full fixed h-full bottom-0 "></div>
      ) : null}
      <div className="flex items-center justify-between w-full border-b-2">
        <h1 className="pb-2 heading-1">Spelling Bee</h1>
        <div className="flex cursor-pointer gap-x-8">
          <button onClick={() => setHints(true)}>today's hints</button>
          <p>yesterday's answers</p>
        </div>
      </div>
      {hints ? (
        <div className="flex flex-col absolute p-10 rounded-xl bg-lightest dark:bg-dark">
          <div className="flex justify-between mb-6 items-baseline">
            <h1></h1>
            <h1 className="heading-1">Today's Hints</h1>
            <button
              className="heading-1 text-center mb-5"
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
        placeholder="Type or click.."
        className="w-full h-20 my-10 text-2xl text-center outline-none dark:bg-background"
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
        <div className="w-full h-56 p-4 rounded-xl bg-lightest dark:bg-dark">
          <div className="flex justify-between">
            <h2 className="heading-3">4 letter words</h2>
            <p>
              {store.fourLetterWords.length} / {store.allFourLetterWords.length}
            </p>
          </div>
          {store.fourLetterWords.map((word, i) => (
            <div key={i}>{word}</div>
          ))}
        </div>
        <div className="w-full h-56 p-4 rounded-xl bg-lightest dark:bg-dark">
          <div className="flex justify-between">
            <h2 className="heading-3">5 letter words</h2>
            <p>
              {store.fiveLetterWords.length} / {store.allFiveLetterWords.length}
            </p>
          </div>
          {store.fiveLetterWords.map((word, i) => (
            <div key={i}>{word}</div>
          ))}
        </div>

        {/* <div className="w-full h-56 p-4 rounded-xl bg-dark">
          <div className="flex justify-between">
            <h2 className="heading-3">6 letter words</h2>
            <p>
              {store.sixLetterWords.length} / {store.allSixLetterWords.length}
            </p>
          </div>
          {store.sixLetterWords.map((word, i) => (
            <div key={i}>{word}</div>
          ))}
        </div> */}
      </div>
      <button onClick={addBeeStats}>Click</button>
    </div>
  );
};

export default observer(SpellingBee);
