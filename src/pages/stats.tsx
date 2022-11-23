import React from "react";
import { useEffect, useState } from "react";

const stats = () => {
  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    gamesPlayed: 0,
    avgScore: 0,
    avgTurns: 0,
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      let stats = JSON.parse(localStorage.getItem("stats"));
      if (stats !== null) setStats(stats);
      console.log(stats);
    }
  }, []);

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="my-10 heading-1">Game Stats</h1>
      <section className="flex w-full gap-x-4">
        <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
          <h2 className="border-b-[0.5px] pb-1 heading-2">Wins</h2>
          <h3 className="text-7xl">{stats.wins}</h3>
        </div>
        <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
          <h2 className="border-b-[0.5px] pb-1 heading-2">Losses</h2>

          <h3 className="text-7xl">{stats.losses}</h3>
        </div>
        <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
          <h2 className="border-b-[0.5px] pb-1  heading-2">Games Played</h2>
          <h3 className="text-7xl">{stats.gamesPlayed}</h3>
        </div>
        <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
          <h2 className="border-b-[0.5px] pb-1  heading-2">Average Score</h2>
          <h3 className="text-7xl">{stats.avgScore}</h3>
        </div>
      </section>
      <section className="flex w-full gap-x-4">
        <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
          <h2 className="border-b-[0.5px] pb-1  heading-2">Win Ratio</h2>
          <h3 className="text-7xl">{stats.gamesPlayed}</h3>
        </div>
        <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
          <h2 className="border-b-[0.5px] pb-1  heading-2">Average Turns</h2>
          <h3 className="text-7xl">{stats.avgTurns}</h3>
        </div>
      </section>
    </div>
  );
};

export default stats;
