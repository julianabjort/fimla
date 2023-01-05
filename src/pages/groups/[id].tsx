import React, { useEffect, useState, useRef } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import WordGrid from "../../components/WordGrid";
import Keyboard from "../../components/Keyboard";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { VscCircleLargeFilled, VscCircleFilled } from "react-icons/vsc";
import WordleStore from "../../stores/WordleStore";
import { useRouter } from "next/router";
import { readFileSync } from "fs";
import { io } from "socket.io-client";
import { HiRefresh, HiX } from "react-icons/hi";

const tournament = () => {
  const { data: session, status } = useSession();

  const [tournament, setTournament] = useState([]);
  const [inTournament, setInTournament] = useState(false);
  const [UsersInTournament, setUsersInTournament] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [modal, setModal] = useState(false);

  const tournamentName = tournament[0]?.["name"];
  const router = useRouter();
  const tournamentID = router.query["id"];
  const userSession = session?.user;
  const userName = session?.user?.["name"];
  const userID = userSession?.["id"];
  const store = useLocalObservable(() => WordleStore);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    store.startGame();
  }, []);
  useEffect(() => {
    store.startGame();
    window.addEventListener("keyup", store.handleKeyup);
    return () => {
      window.removeEventListener("keyup", store.handleKeyup);
    };
  }, [modal]);
  // const readAllUsers = async () => {
  //   try {
  //     const response = await fetch(`/api/user`, {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     const data = await response.json();
  //     const thisTournament = data.filter((i) => i.id === tournamentID);
  //     setTournament(thisTournament);
  //   } catch (error) {
  //     console.log("error reading tournaments: ", error);
  //   }
  // };

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
  const readComments = async () => {
    try {
      const response = await fetch(`/api/comment`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      const comments = data.filter((i) => i.tournamentId === tournamentID);
      setComments(comments);
    } catch (error) {
      console.log("error reading tournaments: ", error);
    }
  };
  const handleComment = (e) => {
    setComment(e.target.value);
  };
  const handleScroll = () => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  };
  const addComment = async () => {
    const body = { userName, tournamentID, userID, comment };
    try {
      const response = await fetch(`/api/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log("error: ", error);
    }
    setComment("");
    readComments();
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
    const body = { userID, tournamentID, totalScore, gamesPlayed };
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
    readComments();
  }, [modal]);
  useEffect(() => {
    readUsersInTournaments();
    readAllTournaments();
    readComments();
  }, [session]);
  useEffect(() => {
    handleScroll();
  }, [comments]);
  useEffect(() => {
    console.log(inTournament);
  }, [inTournament]);
  // console.log("the word: ", store.word);
  useEffect(() => {
    if (store.won || store.lost) {
      updateGuesses();
    }
  }, [store.roundComplete]);

  /**************/
  /* LOOP */
  /**************/
  // useEffect(() => {
  //   readComments();
  // });
  return (
    <div>
      {tournament ? (
        <>
          <div className="flex flex-col">
            {inTournament === true ? (
              <>
                <h1 className="heading-1 mt-10">{tournamentName}</h1>
                <div className="flex flex-row">
                  <div className="flex flex-col mt-5 gap-4">
                    <div className="dark:bg-dark mx-2 px-5 py-3 rounded-md">
                      <h2 className="heading-2">Members</h2>
                      {UsersInTournament.map((i, key) => (
                        <div className="flex p-2 items-center gap-2 bg-lightest dark:bg-darker rounded-md my-2">
                          <VscCircleLargeFilled />
                          <p key={key}>{i["userName"]}</p>
                          <VscCircleFilled />
                        </div>
                      ))}
                    </div>
                    <div className="dark:bg-dark mx-2 px-5 py-3 rounded-md">
                      <h2 className="heading-2 pb-2">Discussion</h2>
                      <div
                        ref={divRef}
                        className={`flex flex-col bg-lightest dark:bg-darker rounded-t-md p-5 items-end overflow-x-hidden h-48 overflow-y-auto`}
                      >
                        {comments.map((i, key) => (
                          <div>
                            <p className="text-xs pl-1">
                              {`${i["userName"]}`.split(" ")[0]}
                            </p>
                            <div
                              key={key}
                              className="flex flex-col my-1 rounded-md bg-lighter dark:bg-dark w-fit p-2"
                            >
                              <p className="text-s">{i["text"]}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex bg-lightest dark:bg-darker rounded-b-md p-5 mb-1">
                        <input
                          type="text"
                          className="p-1 rounded-md dark:bg-dark"
                          onChange={(e) => handleComment(e)}
                          value={comment}
                        />
                        <button
                          value="Submit"
                          onClick={addComment}
                          className="w-16 h-10 ml-4 rounded-md bg-light dark:bg-dark"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                  {modal ? (
                    <div
                      onClick={() => setModal(false)}
                      className="fixed bottom-0 left-0 w-full h-full bg-black bg-opacity-75 "
                    ></div>
                  ) : null}
                  {modal ? (
                    <div className=" absolute top-0 left-0.5 right-0.5">
                      <div className="flex flex-col p-5 rounded-xl items-center my-10 justify-evenly">
                        <div className="bg-white dark:bg-darker w-2/5 flex flex-col p-5 rounded-xl items-center my-10 justify-evenly">
                          <div className="flex justify-between items-center">
                            <h1 className="heading-1">
                              {tournament[0]?.["name"]}
                            </h1>
                            <button
                              onClick={() => setModal(false)}
                              className="heading-1"
                            >
                              <HiX />
                            </button>
                          </div>
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
                              <button onClick={store.startGame}>
                                Play again
                              </button>
                            </>
                          )}
                          <Keyboard store={store} />
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div className="flex flex-col mt-5 gap-4">
                    <div className="dark:bg-dark mx-2 px-5 py-3 rounded-md">
                      <h2 className="heading-2">Tournaments</h2>
                      <div className="flex p-2 items-center justify-between bg-lightest dark:bg-darker rounded-md my-2">
                        <p className="">Wordle</p>
                        <Link href={`/groups/game/${tournamentID}`}>
                          <button className="">Play</button>
                        </Link>
                      </div>
                    </div>
                    <div className="flex flex-col dark:bg-dark mx-2 px-5 py-3 rounded-md">
                      <div className="flex justify-between">
                        <h2 className="heading-2">Leaderboard</h2>
                        <button onClick={readUsersInTournaments}>
                          <HiRefresh />
                        </button>
                      </div>
                      <table className="">
                        <tbody>
                          {UsersInTournament.sort(
                            (prev, next) =>
                              next["totalScore"] - prev["totalScore"]
                          )
                            .slice(0, 10)
                            .map((i, key) => (
                              <tr
                                key={key}
                                className="flex p-2 items-center justify-between gap-2 bg-lightest dark:bg-darker rounded-md my-2"
                              >
                                <td className="p-1">{key + 1}</td>
                                <td className="p-1">
                                  {`${i["userName"]}`.split(" ")[0]}
                                </td>
                                {/* Game played */}
                                <td className="p-1 text-center">
                                  {i["gamesPlayed"]}
                                </td>
                                {/* Avg. Score */}
                                <td className="p-1 flex items-baseline text-right">
                                  <p>
                                    {i["totalScore"] / i["gamesPlayed"] || 0}
                                  </p>
                                  <p className="text-xs">pts</p>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="dark:bg-dark mx-2 p-5 rounded-md">
                      <h2 className="heading-2">Invite Friends</h2>
                      <button
                        className="my-2 bg-light dark:bg-darker px-4 py-2 rounded-md"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `http://localhost:3000/groups/${tournamentID}`
                          );
                        }}
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center my-10 justify-evenly">
                  <h2 className="heading-2 mb-5">
                    Somebody has invited you the group
                  </h2>
                  <h1 className="heading-1 mb-5">{tournament[0]?.["name"]}</h1>
                  {session ? (
                    <button
                      className="w-16 h-10 ml-4 rounded-md bg-light dark:bg-dark"
                      onClick={addUserToTournament}
                    >
                      JOIN
                    </button>
                  ) : (
                    <>
                      <p>You need to have an account to join this group</p>
                      <Link href="/api/auth/signin">
                        <button className="w-16 h-10 ml-4 rounded-md bg-light dark:bg-dark">
                          Sign in
                        </button>
                      </Link>
                    </>
                  )}
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

export default observer(tournament);
