import React, { useEffect, useState } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import WordGrid from "../../components/WordGrid";
import Keyboard from "../../components/Keyboard";

import { useSession } from "next-auth/react";
import WordleStore from "../../stores/WordleStore";

import { useRouter } from "next/router";

const tournament = () => {
  const { data: session, status } = useSession();
  const [tournament, setTournament] = useState([]);
  const tournamentName = tournament[0]?.["name"];
  const router = useRouter();
  const tournamentID = router.query["id"];
  const userSession = session?.user;
  const userName = session?.user?.["name"];
  console.log("username: ", userName);
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
      console.log(check.length, "cheking");
      if (check.length === 1) {
        setInTournament(true);
      } else {
        setInTournament(false);
      }
      console.log("check: ", inTournament);
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
  useEffect(() => {
    readUsersInTournaments();
    readAllTournaments();
    console.log(session, "SESSION");
  }, [session]);
  useEffect(() => {
    console.log(inTournament);
  }, [inTournament]);
  console.log("the word: ", store.word);

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
                    <p>{i["userName"]}</p>
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
                  <Keyboard store={store} />
                </div>
                <div className="dark:bg-dark m-24 p-5 h-full rounded-md">
                  <h2 className="heading-2">Status</h2>
                  {UsersInTournament.map((i, key) => (
                    <>
                      <p>{i["userName"]}</p>
                      <p>{i["guesses"]}</p>
                    </>
                  ))}
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

export default tournament;
