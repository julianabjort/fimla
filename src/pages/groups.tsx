import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoadingIcon from "../components/LoadingIcon";
import getByUserEmail from "../../lib/getByUserEmail";
import updateData from "../../lib/updateData";

const Groups = () => {
  const { data: session, status } = useSession();
  const userSession = session?.user;
  const userEmail = session?.user?.["email"];
  const userName = session?.user?.["name"];
  const [tournamentName, setName] = useState("");
  const [UserInTournament, setUsersInTournament] = useState([]);

  const getUsersInTournaments = async () => {
    getByUserEmail("single-tournament", userSession).then((result) => {
      setUsersInTournament(result);
    });
  };
  useEffect(() => {
    getUsersInTournaments();
  }, [session]);

  const createTournament = async () => {
    const body = { tournamentName, userName, userEmail };
    updateData("tournaments", "POST", body);
    getUsersInTournaments();
  };

  if (status === "loading") return <LoadingIcon />;

  return (
    <div className="flex flex-col items-center my-10 justify-evenly">
      <h1 className="mb-5 heading-1">Create a group</h1>
      <div className="flex flex-col justify-center w-4/5 p-6 rounded-md lg:w-3/4 lg:p-10 bg-lightest dark:bg-darker">
        {session ? (
          <>
            <label className="border-b-[0.5px] pb-1 heading-2 mb-4">
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
                onClick={createTournament}
                className="h-10 px-4 mt-3 rounded-md lg:ml-4 lg:mt-0 bg-light dark:bg-dark"
              >
                Create
              </button>
            </div>

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
