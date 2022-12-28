import React, { useState, useEffect } from "react";
import Link from "next/link";

const scrabble = () => {
  const [tournamentName, setName] = useState("");
  const [tournaments, setTournaments] = useState([]);

  const readTournaments = async () => {
    try {
      const response = await fetch(`/api/tournaments`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setTournaments(data);
      console.log("data: ", data);
      console.log("tournaments: ", tournaments);
    } catch (error) {
      console.log("error reading tournaments: ", error);
    }
  };
  const createTournament = async () => {
    const body = tournamentName;
    console.log(body);
    try {
      const response = await fetch(`/api/tournaments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log("error: ", error);
    }
  };
  useEffect(() => {
    readTournaments();
  }, []);
  useEffect(() => {
    console.log("tournaments: ", tournaments);
  }, [tournaments]);
  return (
    <div className="flex flex-col items-center my-10 justify-evenly">
      <h1 className="heading-1 mb-5">Create a tournament</h1>
      <div className="flex flex-col w-1/2 bg-lighter dark:bg-darker rounded-md p-10 justify-center">
        <form action="#" method="POST" className="flex flex-col">
          <label htmlFor="" className="border-b-[0.5px] pb-1 heading-2">
            Tournament Name
          </label>
          <div className="mt-5">
            <input
              type="text"
              className="p-1 dark:bg-dark rounded-md"
              onChange={(e) => setName(e.target.value)}
            />
            <button
              value="Submit"
              onClick={createTournament}
              className="w-16 h-10 ml-4 rounded-md bg-light dark:bg-dark"
            >
              Create
            </button>
          </div>
        </form>
        <div className="flex flex-col mt-10">
          <h1 className="border-b-[0.5px] pb-1 heading-2">Your tournaments</h1>
          {tournaments.map((i, key) => (
            <ul key={key}>
              <li className="flex justify-between">
                <p>{i.name}</p>
                <Link href={`tournaments/` + i.id}>
                  <button>Join</button>
                </Link>
              </li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
};

export default scrabble;
