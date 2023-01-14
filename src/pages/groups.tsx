import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoadingIcon from "../components/LoadingIcon";

const Groups = () => {
  const { data: session, status } = useSession();
  const userID = session?.user?.["id"];
  const userEmail = session?.user?.["email"];
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
        (i: { userEmail: any }) => i.userEmail === session?.user?.["email"]
      );
      setUsersInTournament(userInTournament);
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
    const body = { tournamentName, userName, userEmail };
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
    readTournaments();
    findUsersInTournaments();
  };

  useEffect(() => {
    findUsersInTournaments();
  }, [session]);
  useEffect(() => {
    console.log(UserInTournament);
    readTournaments();
    function1();
  }, [UserInTournament]);
  if (status === "loading") return <LoadingIcon />;

  return (
    <div className="flex flex-col items-center my-10 justify-evenly">
      <h1 className="mb-5 heading-1">Create a group</h1>
      <div className="flex flex-col justify-center w-4/5 lg:w-3/4 p-6 lg:p-10 rounded-md bg-lightest dark:bg-darker">
        {session ? (
          <>
            {/* <form action="#" method="POST" className="flex flex-col"> */}
            <label htmlFor="" className="border-b-[0.5px] pb-1 heading-2 mb-4">
              Group Name
            </label>
            <div className="flex flex-col lg:flex-row justify-evenly">
              <input
                type="text"
                className="p-1 rounded-md lg:w-full lg:h-10 dark:bg-dark"
                onChange={(e) => setName(e.target.value)}
                value={tournamentName}
              />
              <button
                // value="Submit"
                onClick={createTournament}
                className="mt-3 px-4 h-10 lg:ml-4 lg:mt-0 rounded-md bg-light dark:bg-dark"
              >
                Create
              </button>
            </div>
            {/* </form> */}
            <div className="flex flex-col mt-10">
              <h1 className="border-b-[0.5px] pb-1 heading-2 mb-4">
                Your groups
              </h1>

              {UserInTournament.map((o, key) => (
                <ul key={key}>
                  <Link
                    href={{
                      pathname: "/groups/[id]",
                      query: { id: o["tournamentId"] },
                    }}
                  >
                    <li className="flex justify-between">
                      <p>{o["tournamentName"]}</p>
                      <button>Open</button>
                    </li>
                  </Link>
                </ul>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4">
              <h2 className="border-b-[0.5px] pb-1 heading-2">
                Create your account in a few seconds
              </h2>
              <button className="h-10 px-4 rounded-md bg-light dark:bg-dark">
                Get started
              </button>
              <div className="flex flex-col items-center">
                <p className="text-xs">Already have an account?</p>
                <Link className="text-xs" href="/api/auth/signin">
                  Sign in
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Groups;
