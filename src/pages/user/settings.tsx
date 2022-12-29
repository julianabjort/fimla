import React from "react";
import { useSession, signOut } from "next-auth/react";

const settings = () => {
  const { data: session } = useSession();

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

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="my-10 heading-1">Settings</h1>
      <div className="flex flex-col w-full p-6 rounded-md bg-lighter dark:bg-darker">
        {session ? (
          <>
            <h2 className="border-b-[0.5px] pb-1 heading-2">Username</h2>
            <div className="flex mb-4">
              <label htmlFor=""></label>
              <input type="text" className="p-1 rounded-md" />
              <button className="w-16 h-10 ml-4 rounded-md bg-light">
                Set
              </button>
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
            <p>{session.user?.name}</p>
            <p>{session.user?.email}</p>
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
