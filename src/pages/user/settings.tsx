import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

const settings = () => {
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useState([]);
  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [userDob, setUserDob] = useState("");

  const userSession = session?.user;
  const userId = session?.user?.id;
  const user = session?.user;
  useEffect(() => {
    readUserInfo();
  }, [session]);
  useEffect(() => {
    console.log("userInfo", userInfo);
    console.log(userLocation);
    if (userLocation === "") {
      setUserLocation(userInfo[0]?.userLocation);
    }
    if (userName === "") {
      setUserName(userInfo[0]?.username);
    }
    if (userDob === "") {
      setUserDob(userInfo[0]?.userDob);
    }
  }, [userInfo]);

  const readUserInfo = async () => {
    try {
      const response = await fetch(`/api/userinfo`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const allUserInfo = await response.json();
      const info = allUserInfo.filter((i) => i.userId === userId);
      setUserInfo(info);
      console.log("all user info:", allUserInfo);
      return info;
    } catch (error) {
      console.log("There was an error reading from the DB", error);
    }
    // setUserInfo(info);
    // console.log("the user info:", userInfo);
  };
  const updateUserInfo = async (e: any): Promise<any> => {
    e.preventDefault();
    const body = { userId, userName, userDob, userLocation };
    console.log(JSON.stringify(body));
    console.log("here");
    try {
      const response = fetch(`/api/userinfo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log("There was an error deleting from the DB ", error);
    }
    try {
      const response = fetch(`/api/userinfo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log("There was an error deleting from the DB ", error);
    }
  };

  const deleteUser = async (e: string) => {
    console.log("DELETE USER FUNCTION ", e);

    try {
      const response = await fetch(`/api/user`, {
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
  useEffect(() => {
    console.log(userId);
    console.log(session);
  }, [session]);
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="my-10 heading-1">Settings</h1>
      <div className="flex flex-col w-full p-6 rounded-md bg-lighter dark:bg-darker">
        {session ? (
          <>
            <h1 className="mb-10 heading-1">Hey {session.user?.name}</h1>
            <h2 className="border-b-[0.5px] pb-1 heading-2">
              User Information
            </h2>
            <div className="flex mb-4">
              <form
                className="flex flex-col mb-4"
                action="#"
                method="POST"
                onSubmit={(e) => updateUserInfo(e)}
              >
                <label htmlFor="username">
                  What is your favourite nickname? {userInfo[0]?.username}
                </label>
                <input
                  onChange={(e) => setUserName(e.target.value)}
                  name="username"
                  id="username"
                  type="text"
                  className="p-1 mb-5 rounded-md"
                />
                <label htmlFor="userLocation">
                  Tell us where you are in the world!{" "}
                  {userInfo[0]?.userLocation}
                </label>
                <input
                  onChange={(e) => setUserLocation(e.target.value)}
                  name="userLocation"
                  id="userLocation"
                  type="text"
                  className="p-1 mb-5 rounded-md"
                />
                <label htmlFor="userDob">
                  Date of birth! {userInfo[0]?.userDob}
                </label>
                <input
                  onChange={(e) => setUserDob(e.target.value)}
                  name="userDob"
                  id="userDob"
                  type="date"
                  className="p-1 mb-5 rounded-md"
                />
                <button className="w-16 h-10 ml-4 rounded-md bg-light dark:bg-dark">
                  Update
                </button>
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
