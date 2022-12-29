import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";

const tournament = () => {
  const { data: session, status } = useSession();
  const [tournament, setTournament] = useState([]);
  const router = useRouter();
  const tournamentID = router.query["id"];
  const userSession = session?.user;
  const userID = userSession?.id;

  const readAllUsers = async () => {
    try {
      const response = await fetch(`/api/user`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      const thisTournament = data.filter((i) => i.id === tournamentID);
      console.log("ID: ", tournamentID);
      console.log("This tournament: ", thisTournament);
      setTournament(thisTournament);
    } catch (error) {
      console.log("error reading tournaments: ", error);
    }
  };

  const readAllTournaments = async () => {
    try {
      const response = await fetch(`/api/tournaments`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      const thisTournament = data.filter((i) => i.id === tournamentID);
      console.log("ID: ", tournamentID);
      console.log("This tournament: ", thisTournament);
      setTournament(thisTournament);
    } catch (error) {
      console.log("error reading tournaments: ", error);
    }
  };
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
    const body = { tournamentID, userID };
    console.log(body);
    try {
      const response = await fetch(`/api/single-tournament`, {
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
    readAllTournaments();
    console.log(session);
  }, [session, tournamentID]);
  useEffect(() => {
    console.log(tournament);
  }, [tournament]);
  return (
    <div>
      {session ? (
        <div>
          <h1>Tournament</h1>
          <h1>{tournament[0]?.name}</h1>
          <p>This is: {tournamentID}</p>
          <button onClick={addUserToTournament}>JOIN</button>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default tournament;
