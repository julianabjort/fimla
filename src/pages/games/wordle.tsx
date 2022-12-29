import React from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState } from "react";
import WordGrid from "../../components/WordGrid";
import Keyboard from "../../components/Keyboard";
import WordleStore from "../../stores/WordleStore";
import { useSession } from "next-auth/react";

const wordle = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    totalScore: 0,
    gamesPlayed: 0,
    avgScore: 0
  });
  const store = useLocalObservable(() => WordleStore);

  useEffect(() => {
    store.startGame();
    window.addEventListener("keyup", store.handleKeyup);
    return () => {
      window.removeEventListener("keyup", store.handleKeyup);
    };
  }, []);

  const readWordleStats = async() => {
    if(session){
      const userSession = session?.user
      try{
        const response = await fetch(`/api/wordle-stats`, {
          method: "GET",
          headers: {"Content-Type": "application/json"},
        });
        const allStats = await response.json()
        const myStats = allStats.filter(i => i.userEmail === userSession.email)
        setStats(myStats)
        console.log("my stats: ", myStats)
        console.log("stats: ", stats)
        return myStats
      } catch (error) {
        console.log("error: ", error)
      }
    } else {
      console.log("no session")
    }
  }
  
  useEffect(() => {
    readWordleStats();
  }, [session])

  const addWordleStats = async() => {
    console.log(stats)
    readWordleStats();
    if(session){
      const user = session.user.email
      let wins = 0
      let losses = 0
      let totalScore = 0
      if(!stats[0]){
        totalScore = store.totalScore
        if(store.won){
          wins =  1 
        }
        if(store.lost){
          losses =  1
        }
      } else {
        const userStats = stats[0]
        totalScore = userStats.totalScore + store.totalScore
        console.log("store: ", store.totalScore)
        if(store.won){
          wins = userStats.wins + 1
        }
        if(store.lost){
          losses = userStats.losses + 1
        }
      }
      const body = {user, totalScore, wins, losses}
      console.log("TOTAL: ", totalScore)
    try{
      const response = await fetch(`/api/wordle-stats`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
      });
    }catch(error){
      console.log("error: ", error)
    }
    try{
      const response = await fetch(`/api/wordle-stats`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
      });
    }catch(error){
      console.log("error: ", error)
    }
  }
  }
  console.log("the word: ", store.word)
  return (
    <div className="flex flex-col items-center my-10 justify-evenly">
      <h1 className="heading-1">Wordle</h1>
      <h1 className="h-6 px-2 rounded-md text-error">{store.error}</h1>
      {store.guesses.map((_, i) => (
        <WordGrid
          word={store.word}
          guess={store.guesses[i]}
          isGuessed={i < store.numberOfGuesses}
          key={i}
        />
      ))}
      {store.won && <h1 className="text-lg font-bold">You won! You are good!</h1>}
      {store.lost && <div className="flex items-center my-2 gap-x-8">
            <p className="text-lg font-bold">Almost!  The correct word was:</p>
            <div>
              <p className="text-lg font-bold text-green">
                {store.word} 
              </p>
              
            </div>
          </div>}
      {(store.lost || store.won) && (<>
        <button onClick={store.startGame}>Play again</button>
        <button onClick={addWordleStats}>Save your score!</button>
        </>
      )}
      <Keyboard store={store} />
      {/* <button onClick={store.calculateScore}>Save</button> */}
      {/* <h1>word: {store.word}</h1>
      <h1>guesses: {JSON.stringify(store.guesses)}</h1>
      <h1>numberOfGuesses: {store.numberOfGuesses}</h1> */}
    </div>
  );
};

export default observer(wordle);
