import React, { useEffect, useState } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import WordGrid from "../../components/WordGrid";
import Keyboard from "../../components/Keyboard";
import { useSession } from "next-auth/react";
import WordleStore from "../../stores/WordleStore";
import { useRouter } from "next/router";
import { readFileSync } from "fs";
import { io } from "socket.io-client";

const tournament = () => {
  const { data: session, status } = useSession();
  const [tournament, setTournament] = useState([]);
  const tournamentName = tournament[0]?.["name"];
  const router = useRouter();
  const tournamentID = router.query["id"];
  const userSession = session?.user;
  const userName = session?.user?.["name"];
  const userID = userSession?.["id"];
  const [inTournament, setInTournament] = useState(false);
  const [UsersInTournament, setUsersInTournament] = useState([]);
  const store = useLocalObservable(() => WordleStore);
  useEffect(() => {
    store.startGame();
    window.addEventListener("keyup", store.handleKeyup);
    return () => {
      window.removeEventListener("keyup", store.handleKeyup);
    };
  }, []);
  const readAllUsers = async () => {
    try {
      const response = await fetch(`/api/user`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      const thisTournament = data.filter((i) => i.id === tournamentID);
      setTournament(thisTournament);
    } catch (error) {
      console.log("error reading tournaments: ", error);
    }
  };

  const readAllTournaments = async () => {
    try {
      const response = await fetch(`/api/tournaments`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      const thisTournament = data.filter((i) => i.id === tournamentID);
      setTournament(thisTournament);
    } catch (error) {
      console.log("error reading tournaments: ", error);
    }
  };
  const readUsersInTournaments = async () => {
    try {
      const response = await fetch(`/api/single-tournament`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      const thisTournament = data.filter(
        (i) => i.tournamentId === tournamentID
      );
      setUsersInTournament(thisTournament);
      const check = thisTournament.filter((i) => i.userId === userID);
      if (check.length === 1) {
        setInTournament(true);
      } else {
        setInTournament(false);
      }
    } catch (error) {
      console.log("error reading tournaments: ", error);
    }
  };
  const addUserToTournament = async () => {
    const body = { userName, tournamentID, userID, tournamentName };
    try {
      const response = await fetch(`/api/single-tournament`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log("error: ", error);
    }
    window.location.reload();
  };
  const updateGuesses = async () => {
    let games: any;
    if (store.won) {
      games = UsersInTournament[0]?.["guesses"] + 1;
    } else if (store.lost) {
      games = UsersInTournament[0]?.["guesses"] - 1;
    }
    const totalScore = UsersInTournament[0]?.["guesses"] + store.totalScore;
    const body = { userID, tournamentID, games, totalScore };
    console.log(store.totalScore, "total Score!");
    try {
      const response = await fetch(`/api/single-tournament`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log("error: ", error);
    }
  };
  useEffect(() => {
    readUsersInTournaments();
    readAllTournaments();
  }, [session]);
  useEffect(() => {
    console.log(inTournament);
  }, [inTournament]);
  // console.log("the word: ", store.word);
  if (store.won || store.lost) {
    updateGuesses();
  }
  useEffect(() => {}, []);

  /**************/

  return (
    <div>
      {tournament ? (
        <>
          <div className="flex flex-row my-10 justify-center">
            {inTournament === true ? (
              <>
                <div className="dark:bg-dark m-24 p-5 h-full rounded-md">
                  <h2 className="heading-2">Participants</h2>
                  {UsersInTournament.map((i, key) => (
                    <p key={key}>{i["userName"]}</p>
                  ))}
                </div>

                <div className="flex flex-col items-center my-10 justify-evenly">
                  <h1 className="heading-1">{tournament[0]?.["name"]}</h1>
                  <h1 className="h-6 px-2 rounded-md text-error">
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
                    <h1 className="text-lg font-bold">
                      You won! You are good!
                    </h1>
                  )}
                  {store.lost && (
                    <div className="flex items-center my-2 gap-x-8">
                      <p className="text-lg font-bold">
                        Almost! The correct word was:
                      </p>
                      <div>
                        <p className="text-lg font-bold text-green">
                          {store.word}
                        </p>
                      </div>
                    </div>
                  )}
                  {(store.lost || store.won) && (
                    <>
                      <button onClick={store.startGame}>Play again</button>
                    </>
                  )}
                  <Keyboard store={store} />
                </div>
                <div className="flex flex-col dark:bg-dark m-24 p-5 h-full rounded-md">
                  <div className="flex flex-row gap-2">
                    <h2 className="heading-2">Status</h2>
                    <button onClick={readUsersInTournaments}>X</button>
                  </div>
                  {UsersInTournament.sort(
                    (prev, next) => next["guesses"] - prev["guesses"]
                  )
                    .slice(0, 10)
                    .map((i, key) => (
                      <div key={key} className="flex flex-row gap-2">
                        <p>#</p>
                        <p>{`${i["userName"]}`.split(" ")[0]}</p>
                        {/* Total Score */}
                        <p>{i["guesses"]}</p>
                        {/* Game played */}
                        <p>5</p>
                        {/* Avg. Score */}
                        <p>{i["guesses"] / 5}</p>
                      </div>
                    ))}
                  <button className="bg-light dark:bg-darker rounded-md p-2 w-full">
                    Chat
                  </button>
                  <div>
                    <ul id="messages"></ul>
                    <form id="form" action="">
                      <input id="input" />
                      <button>Send</button>
                    </form>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="heading-2">
                  Somebody has invited you to a tournament
                </h2>
                <button onClick={addUserToTournament}>JOIN</button>
              </>
            )}
          </div>
        </>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default observer(tournament);
