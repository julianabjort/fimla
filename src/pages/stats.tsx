import { useSession } from "next-auth/react";
import React from "react";
import { useEffect, useState } from "react";

const stats = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState({});
  const [qStats, setQstats] = useState({});
  const [wordle, setWordle] = useState(true);
  const [quordle, setQuordle] = useState(false);
  const [wHighScore, setWhighScore] = useState({});
  const [qHighScore, setQhighScore] = useState({});

  let wGamesPlayed = stats[0]?.wins + stats[0]?.losses || 0;
  let qGamesPlayed = qStats[0]?.wins + qStats[0]?.losses || 0;
  const wordleClick = () => {
    setWordle(true);
    setQuordle(false);
  };
  const quordleClick = () => {
    setQuordle(true);
    setWordle(false);
  };
  const WordleStats = async () => {
    if (session) {
      console.log("SESSION");
      const userSession = session?.user;
      try {
        const response = await fetch(`/api/wordle-stats`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const allStats = await response.json();
        const myStats = allStats.filter(
          (i) => i.userEmail === userSession?.email
        );
        // const highScore = Math.max(...allStats.map(i => i.totalScore))
        const highScore = Math.max.apply(
          Math,
          allStats.map(function (i) {
            return i.totalScore;
          })
        );
        const wHighScore = [
          allStats.find(function (i) {
            return i.totalScore == highScore;
          }),
        ];
        setStats(myStats);
        setWhighScore(wHighScore);
      } catch (error) {
        console.log("error: ", error);
      }
      try {
        const response = await fetch(`/api/quordle-stats`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const allStats = await response.json();
        const qStats = allStats.filter(
          (i) => i.userEmail === userSession?.email
        );
        const highScore = Math.max.apply(
          Math,
          allStats.map(function (i) {
            return i.totalScore;
          })
        );
        const qHighScore = [
          allStats.find(function (i) {
            return i.totalScore == highScore;
          }),
        ];
        setQstats(qStats);
        setQhighScore(qHighScore);
      } catch (error) {
        console.log("error: ", error);
      }
    } else {
      console.log("no session");
      let stats = [JSON.parse(localStorage.getItem("stats")!)];
      // let stats: { [key: string]: any }[] = [JSON.parse(localStorage.getItem("stats")!)];

      if (stats !== null) setStats(stats);
      console.log(stats);
    }
  };

  useEffect(() => {
    WordleStats();
    // console.log(gamesPlayed)
  }, [session]);

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="my-10 heading-1">Game Stats</h1>
      <div className="flex flex-row">
        <button onClick={wordleClick} className={`p-4 pl-0 mr-2 rounded-md `}>
          <h4
            className={`border-b-2 ${
              wordle ? "border-black dark:border-white" : "border-transparent"
            }`}
          >
            Wordle
          </h4>
        </button>
        <button onClick={quordleClick} className={`p-4  mr-2 rounded-md `}>
          <h4
            className={`border-b-2 ${
              quordle ? "border-black dark:border-white" : "border-transparent"
            }`}
          >
            Quordle
          </h4>
        </button>
      </div>
      <section className="flex w-full gap-x-4">
        <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
          <h2 className="border-b-[0.5px] pb-1 heading-2">Wins</h2>
          {wordle ? (
            <h3 className="text-7xl">{stats[0]?.wins || 0}</h3>
          ) : quordle ? (
            <h3 className="text-7xl">{qStats[0]?.wins || 0}</h3>
          ) : (
            <></>
          )}
          {/* <h3 className="text-7xl">{stats[0]?.wins}</h3> */}
        </div>
        <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
          <h2 className="border-b-[0.5px] pb-1 heading-2">Losses</h2>
          {wordle ? (
            <h3 className="text-7xl">{stats[0]?.losses || "0"}</h3>
          ) : quordle ? (
            <h3 className="text-7xl">{qStats[0]?.losses || "0"}</h3>
          ) : (
            <></>
          )}
          {/* <h3 className="text-7xl">{stats[0]?.losses}</h3> */}
        </div>
        <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
          <h2 className="border-b-[0.5px] pb-1  heading-2">Games Played</h2>
          {wordle ? (
            <h3 className="text-7xl">{wGamesPlayed || "0"}</h3>
          ) : quordle ? (
            <h3 className="text-7xl">{qGamesPlayed || "0"}</h3>
          ) : (
            <></>
          )}
          {/* <h3 className="text-7xl">{gamesPlayed || ""}</h3> */}
        </div>
        <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
          <h2 className="border-b-[0.5px] pb-1  heading-2">Average Score</h2>
          {wordle ? (
            <h3 className="text-7xl">
              {stats[0]?.totalScore / wGamesPlayed || "0"}
            </h3>
          ) : quordle ? (
            <h3 className="text-7xl">
              {qStats[0]?.totalScore / qGamesPlayed || "0"}
            </h3>
          ) : (
            <></>
          )}
          {/* <h3 className="text-7xl">{stats[0]?.totalScore/gamesPlayed || ""}</h3> */}
        </div>
      </section>
      <section className="flex w-full gap-x-4">
        <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
          <h2 className="border-b-[0.5px] pb-1  heading-2">Win Ratio</h2>
          {wordle ? (
            <h3 className="text-7xl">
              {(stats[0]?.wins / wGamesPlayed) * 100 + "%" || "0"}
            </h3>
          ) : quordle ? (
            <h3 className="text-7xl">
              {(qStats[0]?.wins / qGamesPlayed) * 100 + "%" || "0"}
            </h3>
          ) : (
            <></>
          )}{" "}
        </div>
        <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
          <h2 className="border-b-[0.5px] pb-1  heading-2">Total Score</h2>
          {/* <h3 className="text-7xl">{stats.avgTurns}</h3> */}
          {/* showing total score now */}
          {wordle ? (
            <h3 className="text-7xl">{stats[0]?.totalScore || "0"}</h3>
          ) : quordle ? (
            <h3 className="text-7xl">{qStats[0]?.totalScore || "0"}</h3>
          ) : (
            <></>
          )}
          {/* <h3 className="text-7xl">{stats[0]?.totalScore || ""}</h3> */}
        </div>
      </section>
      <div className="flex flex-col justify-between w-full p-6 rounded-md bg-lighter dark:bg-darker">
        <h2 className="border-b-[0.5px] pb-1  heading-2">Record holders</h2>
        {wordle ? (
          <div className="grid grid-flow-col mt-4">
            <p>{wHighScore[0]?.userEmail.split("@")[0] || ""}</p>
            <p className="">{wHighScore[0]?.totalScore || ""}</p>{" "}
          </div>
        ) : quordle ? (
          <div className="grid grid-flow-col mt-4">
            <p>{qHighScore[0]?.userEmail.split("@")[0] || ""}</p>
            <p className="">{qHighScore[0]?.totalScore || ""}</p>{" "}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default stats;
