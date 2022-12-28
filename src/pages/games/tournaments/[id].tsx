import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";

const tournament = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const id = router.query["id"];

  const readUsersInTournaments = async () => {
    try {
      const response = await fetch(`/api/single-tournament`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      console.log("data: ", data);
    } catch (error) {
      console.log("error reading tournaments: ", error);
    }
  };
  const addUserToTournament = async () => {
    const body = { id, session };
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
    readUsersInTournaments();
    console.log(session);
  }, [session]);
  return (
    <div>
      {session ? (
        <div>
          <p> Hello It Works!</p>
          <p>This is: {id}</p>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default tournament;
