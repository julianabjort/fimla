import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const groups = () => {
  const { data: session } = useSession();
  const userID = session?.user?.["id"];
  const userName = session?.user?.["name"];
  const [tournamentName, setName] = useState("");
  const [tournaments, setTournaments] = useState([]);
  const [UserInTournament, setUsersInTournament] = useState([]);
  const findUsersInTournaments = async () => {
    try {
      const response = await fetch(`/api/single-tournament`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      const userInTournament = data.filter(
        (i: { userId: any }) => i.userId === session?.user?.["id"]
      );
      setUsersInTournament(userInTournament);
      // console.log("data: ", data);
      // console.log("users in tournaments: ", UsersInTournament);
    } catch (error) {
      console.log("error reading tournaments: ", error);
    }
  };

  const readTournaments = async () => {
    try {
      const response = await fetch(`/api/tournaments`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      const myTournaments = data.filter(
        (i: { id: any }) => i.id === UserInTournament["id"]
      );
      data.includes();
      setTournaments(data);
      console.log("data: ", data);
      // console.log("tournaments: ", tournaments);
    } catch (error) {
      console.log("error reading tournaments: ", error);
    }
  };
  const function1 = () => {
    console.log(
      "hello",
      UserInTournament.filter((i) => i["tournamentId"] === tournaments["id"])
    );
  };
  const createTournament = async () => {
    const body = { tournamentName, userName, userID };
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
  // const addUserToTournament = async () => {
  //   const tournamentName = tournament[0]?.['name'];
  //   const body = { userName, tournamentID, userID, tournamentName };
  //   console.log(body);
  //   try {
  //     const response = await fetch(`/api/single-tournament`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(body),
  //     });
  //   } catch (error) {
  //     console.log("error: ", error);
  //   }
  // };
  useEffect(() => {
    findUsersInTournaments();
  }, [session]);
  useEffect(() => {
    console.log(UserInTournament);
    readTournaments();
    function1();
  }, [UserInTournament]);
  return (
    <div className="flex flex-col items-center my-10 justify-evenly">
      <h1 className="mb-5 heading-1">Create a group</h1>
      <div className="flex flex-col justify-center w-1/2 p-10 rounded-md bg-lighter dark:bg-darker">
        {session ? (
          <>
            <form action="" method="POST" className="flex flex-col">
              <label htmlFor="" className="border-b-[0.5px] pb-1 heading-2">
                Group Name
              </label>
              <div className="mt-5">
                <input
                  type="text"
                  className="p-1 rounded-md dark:bg-dark"
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
              <h1 className="border-b-[0.5px] pb-1 heading-2">Your groups</h1>

              {UserInTournament.map((o, key) => (
                <ul key={key}>
                  <li className="flex justify-between">
                    <p>{o["tournamentName"]}</p>

                    <Link href={`groups/` + o["tournamentId"]}>
                      <button>Open</button>
                    </Link>
                  </li>
                </ul>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4">
              <h2 className="border-b-[0.5px] pb-1 heading-2">
                To create a group you need to
              </h2>
              <button className="h-10 px-4 rounded-md bg-light">Sign in</button>
              <p>or</p>
              <button className="h-10 px-4 rounded-md bg-light">
                Create a new account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default groups;
