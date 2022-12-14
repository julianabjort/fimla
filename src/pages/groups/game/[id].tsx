import React, { useEffect, useState } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import WordGrid from "../../../components/WordGrid";
import Keyboard from "../../../components/Keyboard";
import { useSession } from "next-auth/react";
import WordleStore from "../../../stores/WordleStore";
import { useRouter } from "next/router";
import { readFileSync } from "fs";
import { io } from "socket.io-client";
import Link from "next/link";
import { HiRefresh, HiArrowNarrowLeft } from "react-icons/hi";

const Tournament = () => {
  const { data: session, status } = useSession();
  const [tournament, setTournament] = useState([]);
  const tournamentName = tournament[0]?.["name"];
  const router = useRouter();
  const tournamentID = router.query["id"];
  const userSession = session?.user;
  const userName = session?.user?.["name"];
  const userID = userSession?.["id"];
  const userEmail = userSession?.["email"];
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
    console.log(body);
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
    let gamesPlayed: any;
    if (store.won || store.lost) {
      gamesPlayed = UsersInTournament[0]?.["gamesPlayed"] + 1;
    }
    const totalScore = UsersInTournament[0]?.["totalScore"] + store.totalScore;
    const body = { userEmail, tournamentID, totalScore, gamesPlayed };
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
  useEffect(() => {
    if (store.won || store.lost) {
      updateGuesses();
    }
  }, [store.roundComplete]);

  return (
    <div>
      {tournament ? (
        <>
          <div className="flex flex-row justify-center">
            {inTournament === true ? (
              <>
                <button className="h-full p-5 mx-2 my-8 heading-2">
                  <Link href={`/groups/${tournamentID}`}>
                    <HiArrowNarrowLeft />
                  </Link>
                </button>

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
                <div className="flex flex-col h-full p-5 mx-2 my-20 rounded-md dark:bg-dark">
                  <div className="flex flex-row justify-center gap-4">
                    <h2 className="heading-2">Status</h2>
                    <button onClick={readUsersInTournaments}>
                      <HiRefresh />
                    </button>
                  </div>

                  <table className="">
                    <tbody>
                      {UsersInTournament.sort(
                        (prev, next) => next["totalScore"] - prev["totalScore"]
                      )
                        .slice(0, 10)
                        .map((user, i) => (
                          <tr
                            key={i}
                            className="flex items-center justify-between gap-2 p-2 my-2 rounded-md bg-lightest dark:bg-darker"
                          >
                            <td className="p-1">{i + 1}</td>
                            <td className="p-1">
                              {`${user["userName"]}`.split(" ")[0]}
                            </td>
                            {/* Game played */}
                            <td className="p-1 text-center">
                              {user["gamesPlayed"]}
                            </td>
                            {/* Avg. Score */}
                            <td className="flex items-baseline p-1 text-right">
                              <p>
                                {user["totalScore"] / user["gamesPlayed"] || 0}
                              </p>
                              <p className="text-xs">pts</p>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center my-10 justify-evenly">
                  <h2 className="mb-5 heading-2">
                    Somebody has invited you the group
                  </h2>
                  <h1 className="mb-5 heading-1">{tournament[0]?.["name"]}</h1>
                  <button
                    className="w-16 h-10 ml-4 rounded-md bg-light dark:bg-dark"
                    onClick={addUserToTournament}
                  >
                    JOIN
                  </button>
                </div>
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

export default observer(Tournament);
