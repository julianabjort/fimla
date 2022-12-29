import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

const settings = () => {
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useState({});
  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [userDob, setUserDob] = useState("");

  const userSession = session?.user;
  const userId = session?.user.id;
  // useEffect(() => {
  //   console.log(userId, userName, userLocation, userDob);
  // }, [session, userName, userLocation, userDob]);

  const readUserInfo = async () => {
    // try {
    //   const response = await fetch(`/api/user-stats`, {
    //     method: "GET",
    //     headers: { "Content-Type": "application/json" },
    //   });
    //   console.log("RESPONSY", userSession);
    //   setUserInfo(await response.json());
    // } catch (error) {
    //   console.log("There was an error reading from the DB ", error);
    // }
    // console.log("Usersession.id: ", userSession.id);
    // let theUser = users.filter((i) => i.id === userSession.id);
    // console.log("user: ", theUser);
    // setUser(theUser);
    // console.log("the user:", theUser);
  };
  const updateUserInfo = async (e: string) => {
    // if no userinfo then create
    const body = { userId, userName, userLocation, userDob };

    try {
      const response = await fetch(`/api/username`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      // if already is userinfo then update
    } catch (error) {
      console.log("There was an error posting to the DB ", error);
    }
  };
  const deleteUser = async (e: string) => {
    console.log("DELETE USER FUNCTION ", e);

    try {
      const response = await fetch(`/api/delete-user`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e),
      });
      console.log("RESPONSY", response.json());
      signOut();

      // Redirect to home page ? //
    } catch (error) {
      console.log("There was an error deleting from the DB ", error);
    }
  };

  const deleteStats = async (e: string) => {
    console.log("Deleting Wordle Stats", e);
    try {
      const response = await fetch(`/api/wordle-stats`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e),
      });
      console.log("Deleted", response.json());
      const response2 = await fetch(`/api/quordle-stats`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e),
      });
      console.log("Deleted", response2.json());
    } catch (error) {
      console.log("There was an error in deleting from the DB", error);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="my-10 heading-1">Settings</h1>
      <div className="flex flex-col w-full p-6 rounded-md bg-lighter dark:bg-darker">
        {session ? (
          <>
            <h1 className="heading-1 mb-10">Hey {session.user?.name}</h1>
            <h2 className="border-b-[0.5px] pb-1 heading-2">
              User Information
            </h2>
            <div className="flex mb-4">
              <form className="flex flex-col mb-4" action="">
                <label htmlFor="">What is your favourite nickname?</label>
                <input
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="current nickname"
                  type="text"
                  className="p-1 rounded-md mb-5"
                />
                <label htmlFor="">Date of Birth</label>
                <input
                  onChange={(e) => setUserDob(e.target.value)}
                  placeholder="01/01/2023"
                  type="date"
                  className="p-1 rounded-md mb-5"
                />
                <label htmlFor="">Tell us where you are in the world!</label>
                <input
                  onChange={(e) => setUserLocation(e.target.value)}
                  placeholder="Maybe Iceland?"
                  type="text"
                  className="p-1 rounded-md mb-5"
                />
              </form>
            </div>
            <h2 className="border-b-[0.5px] pb-1 mt-2 heading-2">
              Reset Account
            </h2>
            <div className="flex flex-col gap-2 mb-4">
              <p>Clear your stats and game history</p>
              <button
                className="h-10 rounded-md w-28 bg-light"
                onClick={() => deleteStats(session.user?.email)}
              >
                Reset Stats
              </button>
            </div>
            <h2 className="border-b-[0.5px] pb-1 mt-2 heading-2">
              Delete Account
            </h2>
            <div className="flex flex-col gap-2 mb-4">
              <p>
                Want to delete your account? Note: This action can not be redone
              </p>
              <button
                className="w-32 h-10 rounded-md bg-light"
                onClick={() => deleteUser(session.user?.email)}
              >
                Delete Account
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4">
              <h2 className="border-b-[0.5px] pb-1 heading-2">
                You are not signed in
              </h2>
              <button className="h-10 px-4 rounded-md bg-light">
                Create a new account
              </button>
              <p>or</p>
              <button className="h-10 px-4 rounded-md bg-light">Sign in</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default settings;
