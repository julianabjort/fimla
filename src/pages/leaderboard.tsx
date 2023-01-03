import React from "react";
import { useEffect, useState } from "react";

const leaderboard = () => {
  const [wordle, setWordle] = useState(true);
  const [quordle, setQuordle] = useState(false);
  const [spellingBee, setSpellingBee] = useState(false);
  const [wHighScore, setWhighScore] = useState({});
  const [qHighScore, setQhighScore] = useState({});
  const [stats, setStats] = useState([]);
  const [users, setUsers] = useState([]);
  const readUsers = async () => {
    try {
      const response = await fetch(`/api/user`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const allUsers = await response.json();
      setUsers(allUsers);
    } catch (error) {
      console.log("error: ", error);
    }
  };
  const wHighScores = async () => {
    try {
      const response = await fetch(`/api/wordle-stats`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const allStats = await response.json();
      setStats(allStats);
      const highScore = Math.max.apply(
        Math,
        allStats.map(function (i) {
          return i.totalScore;
        })
      );
      const number = allStats.list.map((i) => {
        return i.totalScore;
      });
      const wHighScore = [
        allStats.find(function (i) {
          return i.totalScore == highScore;
        }),
      ];
      setWhighScore(wHighScore);
    } catch (error) {
      console.log("error: ", error);
    }
  };
  useEffect(() => {
    readUsers();
    wHighScores();
  }, []);
  useEffect(() => {
    // console.log(users[0].["wordleStats"]);
    // console.log(stats?.user);
  }, [users]);
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="my-10 heading-1">Leaderboard</h1>
      <section className="flex w-full p-10 rounded-md bg-lighter dark:bg-darker">
        <div>
          <table>
            <tbody>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Location</th>
                <th>Score</th>
              </tr>

              {stats
                ?.filter((item) => item["totalScore"])
                .sort((prev, next) => next["totalScore"] - prev["totalScore"])
                .slice(0, 5)
                .map((item) => (
                  <tr key={item["id"]}>
                    <td>#</td>
                    <td>{item["userEmail"]}</td>
                    <td>{item["totalScore"]}</td>
                  </tr>
                ))}
              {/* <td>1</td>
                <td>{wHighScore[0]?.userEmail.split("@")[0] || ""}</td>
                <td>Blu</td>
                <td>{wHighScore[0]?.totalScore || ""}</td> */}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default leaderboard;
