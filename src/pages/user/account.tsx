import React from "react";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";

const account = () => {
  const { data: session } = useSession();

  const deleteUser = async(e:any) => {
    console.log("DELETE USER FUNCTION ", e)

    try{
      const response = await fetch(`/api/delete-user`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(e)
      });
      console.log("RESPONSY", response.json())
      signOut()

      // Redirect to home page ? //
      
;    } catch(error){
      console.log("There was an error deleting from the DB ", error)
    }

  }

  return (
  <div>
    <div>
      <h1>Account</h1>
    {session ? (
      <>
        <p>{session.user?.name}</p>
        <p>{session.user?.email}</p>
        <button className="p-2 bg-white text-black rounded-md" onClick={() => deleteUser(session.user?.email)}>Delete account</button>
      </>
      ) : (
        <p>Not signed in</p>
        )}
    </div>
  </div>
  );
};

export default account;
