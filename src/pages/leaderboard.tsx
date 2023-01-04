import React from "react";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { prisma } from "../../lib/prisma";

const leaderboard = ({ wordleSessionStats, quordleSessionStats }) => {
  const { data: session } = useSession();
  const [wordle, setWordle] = useState(true);
  const [quordle, setQuordle] = useState(false);
  const [spellingBee, setSpellingBee] = useState(false);
  const [wHighScore, setWhighScore] = useState({});
  const [qHighScore, setQhighScore] = useState({});
  const [stats, setStats] = useState([]);
  const [users, setUsers] = useState([]);

  const wordleClick = () => {
    setWordle(true);
    setQuordle(false);
  };
  const quordleClick = () => {
    setQuordle(true);
    setWordle(false);
  };
  const initLeaderBoardW = () => {
    setStats(wordleSessionStats);
    // const highScore = Math.max.apply(
    //   Math,
    //   wordleSessionStats.map(function (i) {
    //     return i.totalScore;
    //   })
    // );
    // console.log("high", highScore);
    // const number = wordleSessionStats.list.map((i) => {
    //   return i.totalScore;
    // });
    // const wHighScore = [
    //   wordleSessionStats.find(function (i) {
    //     return i.totalScore == highScore;
    //   }),
    // ];
    // setWhighScore(wHighScore);
  };
  const initLeaderBoardQ = () => {
    setStats(quordleSessionStats);
  };
  // const readUsers = async () => {
  //   try {
  //     const response = await fetch(`/api/user`, {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     const allUsers = await response.json();
  //     setUsers(allUsers);
  //   } catch (error) {
  //     console.log("error: ", error);
  //   }
  // };
  // const wHighScores = async () => {
  //   try {
  //     const response = await fetch(`/api/wordle-stats`, {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     const allStats = await response.json();
  //     setStats(allStats);
  //     const highScore = Math.max.apply(
  //       Math,
  //       allStats.map(function (i) {
  //         return i.totalScore;
  //       })
  //     );
  //     const number = allStats.list.map((i) => {
  //       return i.totalScore;
  //     });
  //     const wHighScore = [
  //       allStats.find(function (i) {
  //         return i.totalScore == highScore;
  //       }),
  //     ];
  //     setWhighScore(wHighScore);
  //   } catch (error) {
  //     console.log("error: ", error);
  //   }
  // };
  useEffect(() => {
    // readUsers();
  }, []);
  useEffect(() => {
    if (quordle) initLeaderBoardQ();
  }, [quordle]);
  useEffect(() => {
    if (wordle) initLeaderBoardW();
  }, [wordle]);
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="my-10 heading-1">Leaderboard</h1>
      <div className="flex mb-3 space-x-4 cursor-pointer">
        <h3
          className={`${wordle && "underline underline-offset-4"}`}
          onClick={wordleClick}
        >
          Wordle
        </h3>
        <h3
          className={`${quordle && "underline underline-offset-4"}`}
          onClick={quordleClick}
        >
          Quordle
        </h3>
      </div>
      <section className="flex w-full p-10 rounded-md bg-lighter dark:bg-darker">
        <table className="w-full">
          <tbody>
            <tr>
              <th className="w-1/3 text-left">Rank</th>
              <th className="w-1/3 text-left">Name</th>
              <th className="w-1/3 text-left">Score</th>
            </tr>

            {stats
              ?.filter((item) => item["totalScore"])
              .sort((prev, next) => next["totalScore"] - prev["totalScore"])
              .slice(0, 5)
              .map((item) => (
                <tr key={item["id"]}>
                  <td className="w-1/3">#</td>
                  <td className="w-1/3">
                    {`${item["userEmail"]}`.split("@")[0]}
                  </td>
                  <td className="w-1/3">{item["totalScore"]}</td>
                </tr>
              ))}
            {/* <td>1</td>
                <td>{wHighScore[0]?.userEmail.split("@")[0] || ""}</td>
                <td>Blu</td>
                <td>{wHighScore[0]?.totalScore || ""}</td> */}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default leaderboard;

export const getServerSideProps = async () => {
  const wordleData = await prisma.wordleStats.findMany({});
  const quordleData = await prisma.quordleStats.findMany({});

  const wordleSessionStats = wordleData || null;
  const quordleSessionStats = quordleData || null;

  return { props: { wordleSessionStats, quordleSessionStats } };
};
