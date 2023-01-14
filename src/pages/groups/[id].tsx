import React, { useEffect, useState, useRef } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useSession } from "next-auth/react";
import { VscCircleLargeFilled, VscCircleFilled } from "react-icons/vsc";
import { useRouter } from "next/router";
import { HiRefresh, HiX, HiOutlineChat } from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";
import WordGrid from "../../components/WordGrid";
import Keyboard from "../../components/Keyboard";
import WordleStore from "../../stores/WordleStore";
import LoadingIcon from "../../components/LoadingIcon";

const Tournament = () => {
  const { data: session, status } = useSession();
  const [chat, showChat] = useState(false);
  const [tournament, setTournament] = useState([]);
  const [inTournament, setInTournament] = useState(false);
  const [UsersInTournament, setUsersInTournament] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [modal, setModal] = useState(false);
  const [myUser, setMyUser] = useState([]);
  const [pPic, setProfilePic] = useState(
    "https://res.cloudinary.com/diczrtchl/image/upload/v1673611647/figma-profile-pics/a5gyee4oj1tlk9edfzlv.png"
  );
  const tournamentName = tournament[0]?.["name"];
  const router = useRouter();
  const tournamentID = router.query["id"];
  const userSession = session?.user;
  const userName = session?.user?.["name"];
  const userID = userSession?.["id"];
  const userEmail = userSession?.["email"];
  const store = useLocalObservable(() => WordleStore);
  const divRef = useRef<HTMLDivElement>(null);
  const imageUser = myUser[0]?.["image"];
  const noUserPic =
    "https://res.cloudinary.com/diczrtchl/image/upload/v1673611647/figma-profile-pics/a5gyee4oj1tlk9edfzlv.png";

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
  const readUser = async () => {
    try {
      const response = await fetch(`/api/user`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const allUsers = await response.json();
      const info = allUsers.filter((i: number) => i["email"] === userEmail);
      setMyUser(info);
      return info;
    } catch (error) {
      console.log("There was an error reading from the DB", error);
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
      const check = thisTournament.filter((i) => i.userEmail === userEmail);
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
    const body = { userName, tournamentID, userEmail, comment };
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
    const body = { userName, tournamentID, userEmail, tournamentName };
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
    readComments();
  }, [modal]);
  useEffect(() => {
    readUsersInTournaments();
    readAllTournaments();
    readComments();
    readUser();
  }, [session]);
  useEffect(() => {
    handleScroll();
  }, [comments]);
  useEffect(() => {
    if (store.won || store.lost) {
      updateGuesses();
    }
  }, [store.roundComplete]);
  useEffect(() => {
    if (imageUser !== null) {
      setProfilePic(imageUser);
    } else {
      setProfilePic(noUserPic);
    }
  }, [myUser]);
  useEffect(() => {
    if (window.innerWidth < 768) {
      /* Screen is smaller than 768 and is on mobileview */
      showChat(false);
    }
    if (window.screen.width >= 768) {
      /* Screen is bigger than 768 and is probably on desktop or ipad */
      showChat(true);
    }
  }, []);
  /**************/
  /* LOOP */
  /**************/
  // useEffect(() => {
  //   readComments();
  // });
  if (status === "loading") return <LoadingIcon />;

  return (
    <div>
      {tournament ? (
        <>
          <div className="flex flex-col">
            {inTournament === true ? (
              <>
                <button
                  className="md:hidden fixed bottom-3 flex right-3 h-20 w-20 rounded-full bg-purple2 shadow-md items-center  justify-center"
                  onClick={() => showChat(true)}
                >
                  <HiOutlineChat className="text-6xl text-white" />
                </button>
                {modal ? (
                  <div
                    onClick={() => setModal(false)}
                    className="fixed bottom-0 left-0 w-full h-full bg-black bg-opacity-75 "
                  ></div>
                ) : null}
                {modal ? (
                  <div className=" absolute top-0 left-0.5 right-0.5">
                    <div className="flex flex-col items-center p-5 my-10 rounded-xl justify-evenly">
                      <div className="flex flex-col items-center w-2/5 p-5 my-10 bg-white dark:bg-darker rounded-xl justify-evenly">
                        <div className="flex items-center justify-between">
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
                <h1 className="mt-10 heading-1">{tournamentName}</h1>
                <div className="flex flex-col">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                    <div className="row-start-3 md:row-start-1 h-fit px-5 py-3 mx-2 rounded-md dark:bg-dark">
                      <h2 className="heading-2">Members</h2>
                      {UsersInTournament.map((user, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 my-2 rounded-md bg-lightest dark:bg-darker"
                        >
                          <div className=" rounded-full h-12 w-12  overflow-hidden">
                            <Image
                              src={pPic}
                              width={100}
                              height={100}
                              alt="image"
                              priority
                            />
                          </div>
                          <p>{user["userName"]}</p>
                          <VscCircleFilled className="text-gray-300" />
                        </div>
                      ))}
                    </div>

                    <div className="row-start-1 h-fit px-5 py-3 mx-2 rounded-md dark:bg-dark">
                      <h2 className="heading-2">Tournaments</h2>
                      <div className="flex items-center justify-between p-2 my-2 rounded-md bg-lightest dark:bg-darker">
                        <p className="">Wordle</p>
                        <Link href={`/groups/game/${tournamentID}`}>
                          <button className="">Play</button>
                        </Link>
                      </div>
                    </div>

                    {chat && (
                      <div className="fixed bottom-0 left-0 right-0 md:relative md:row-start-2 md:row-span-3 px-5 py-3 mx-2 rounded-md bg-lightest dark:bg-dark">
                        <div className="flex justify-between">
                          <h2 className="pb-2 heading-2">Discussion</h2>
                          <button
                            className="md:hidden"
                            onClick={() => showChat(false)}
                          >
                            <HiX className="text-xl" />
                          </button>
                        </div>

                        <div
                          ref={divRef}
                          className={`flex flex-col bg-white dark:bg-darker rounded-t-md p-5 items-end overflow-x-hidden h-48 overflow-y-auto`}
                        >
                          {comments.map((user, i) => (
                            <div key={i}>
                              <p className="pl-1 text-xs">
                                {`${user["userName"]}`.split(" ")[0]}
                              </p>
                              <div
                                key={i}
                                className="flex flex-col p-2 my-1 rounded-md bg-lighter dark:bg-dark w-fit"
                              >
                                <p className="text-s">{user["text"]}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex p-4 mb-1 bg-lightest dark:bg-darker rounded-b-md">
                          <input
                            type="text"
                            className="p-1 w-full rounded-md dark:bg-dark"
                            onChange={(e) => handleComment(e)}
                            value={comment}
                          />
                          <button
                            value="Submit"
                            onClick={addComment}
                            className="h-10 px-4 ml-4 rounded-md bg-light dark:bg-dark"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="row-start-2 h-fit flex flex-col px-5 py-3 mx-2 rounded-md dark:bg-dark">
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
                                    {user["totalScore"] / user["gamesPlayed"] ||
                                      0}
                                  </p>
                                  <p className="text-xs">pts</p>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="md:col-start-2 p-5 mx-2 rounded-md dark:bg-dark">
                      <h2 className="heading-2">Invite Friends</h2>
                      <button
                        className="px-4 py-2 my-2 rounded-md bg-light dark:bg-darker"
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
                  <h2 className="mb-5 heading-2">
                    Somebody has invited you the group
                  </h2>
                  <h1 className="mb-5 heading-1">{tournament[0]?.["name"]}</h1>
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

export default observer(Tournament);
