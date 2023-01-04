import { getSession, useSession } from "next-auth/react";
import React from "react";
import { useEffect, useState } from "react";
import { prisma } from "../../lib/prisma";

const StatsSsr = ({
  wordleSessionStats,
  quordleSessionStats,
  beeSessionStats,
}) => {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const noStats = {
    wins: 0,
    losses: 0,
    gamesPlayed: 0,
    totalScore: 0,
    avgScore: 0,
  };
  const [stats, setStats] = useState(noStats);
  const [beeStats, setBeeStats] = useState(noStats);
  const [wordle, setWordle] = useState(true);
  const [quordle, setQuordle] = useState(false);
  const [bee, setBee] = useState(false);

  const wordleClick = () => {
    setWordle(true);
    setQuordle(false);
    setBee(false);
    setMessage("");
  };
  const quordleClick = () => {
    setQuordle(true);
    setWordle(false);
    setBee(false);
  };
  const beeClick = () => {
    setBee(true);
    setQuordle(false);
    setWordle(false);
  };

  const initWordleStats = () => {
      if (session && !wordleSessionStats) {
        setStats(noStats);
      }
      if (session) {
        setStats(wordleSessionStats);
      } else if (typeof window !== undefined) {
        let data = [JSON.parse(localStorage.getItem("stats")!)];
        const wordleLocalStats = data[0];
        if (stats !== null) setStats(wordleLocalStats);
      }
    },
    initQuordleStats = () => {
      if (session && !quordleSessionStats) {
        setStats(noStats);
      } else if (session) {
        setStats(quordleSessionStats);
      } else if (quordle === true) {
        setStats(noStats);
        setMessage(
          "Create an account to see Quordle stats (it takes 2 minutes & it's free!)"
        );
      }
    },
    initBeeStats = () => {
      if (session && !beeSessionStats) {
        setBeeStats(noStats);
      } else if (session) {
        setBeeStats(beeSessionStats);
      } else if (bee === true) {
        setBeeStats(noStats);
        setMessage(
          "Create an account to see Spelling Bee stats (it takes 2 minutes & it's free!)"
        );
      }
    };

  useEffect(() => {
    initWordleStats();
  }, [session]);
  useEffect(() => {
    if (quordle) initQuordleStats();
  }, [quordle]);
  useEffect(() => {
    if (wordle) initWordleStats();
  }, [wordle]);
  useEffect(() => {
    if (bee) initBeeStats();
  }, [bee]);

  if (stats) {
    return (
      <div>
        <h1 className="my-10 heading-1">Game Stats</h1>

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
          <h3
            className={`${bee && "underline underline-offset-4"}`}
            onClick={beeClick}
          >
            Spelling Bee
          </h3>
          <p className="font-bold text-green">{message}</p>
        </div>
        {!bee ? (
          <>
            <div className="flex w-full mb-4 space-x-4">
              <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
                <h1 className="border-b-[0.5px] pb-1 heading-2">Wins</h1>
                <h1 className="text-7xl">{stats.wins}</h1>
              </div>
              <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
                <h1 className="border-b-[0.5px] pb-1 heading-2">Losses</h1>
                <h1 className="text-7xl">{stats.losses}</h1>
              </div>
              <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
                <h1 className="border-b-[0.5px] pb-1 heading-2">
                  Games Played
                </h1>
                <h1 className="text-7xl">{stats.wins + stats.losses}</h1>
              </div>
              <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
                <h1 className="border-b-[0.5px] pb-1 heading-2">
                  Average Score
                </h1>
                <h1 className="text-7xl">
                  {stats.totalScore > 0 ? (
                    <>
                      {(stats.totalScore / (stats.wins + stats.losses)).toFixed(
                        0
                      )}
                    </>
                  ) : (
                    <>0</>
                  )}
                </h1>
              </div>
            </div>
            <div className="flex w-full space-x-4">
              <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
                <h2 className="border-b-[0.5px] pb-1  heading-2">Win Ratio</h2>
                <h3 className="text-7xl">
                  {stats.wins > 0 || stats.losses > 0 ? (
                    <>
                      {(stats.wins / (stats.wins + stats.losses)) * 100 + "%"}
                    </>
                  ) : (
                    <>0%</>
                  )}
                </h3>
              </div>
              <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
                <h2 className="border-b-[0.5px] pb-1  heading-2">
                  Total Score
                </h2>

                <h3 className="text-7xl">{stats.totalScore || "0"}</h3>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex w-full space-x-4">
              <div className="flex flex-col justify-between w-full h-56 p-6 rounded-md bg-lighter dark:bg-darker">
                <h2 className="border-b-[0.5px] pb-1  heading-2">
                  Total Score
                </h2>

                <h3 className="text-7xl">{beeStats.totalScore || "0"}</h3>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
};

export default StatsSsr;

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  const getEmail = session?.user?.email;
  const userEmail = getEmail?.toString();

  const wordleData = await prisma.wordleStats.findMany({
    where: {
      userEmail: userEmail,
    },
  });
  const quordleData = await prisma.quordleStats.findMany({
    where: {
      userEmail: userEmail,
    },
  });
  const beeData = await prisma.spellingBeeStats.findMany({
    where: {
      userEmail: userEmail,
    },
  });
  const wordleSessionStats = wordleData[0] || null;
  const quordleSessionStats = quordleData[0] || null;
  const beeSessionStats = beeData[0] || null;

  return {
    props: { wordleSessionStats, quordleSessionStats, beeSessionStats },
  };
};
