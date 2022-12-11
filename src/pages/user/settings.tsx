import React from "react";
import { useSession, signOut } from "next-auth/react";

const settings = () => {
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
  <div className="flex flex-col gap-y-4">
    <h1 className="my-10 heading-1">Settings</h1>
    <div className="flex w-full flex-col rounded-md bg-lighter dark:bg-darker p-6">
    {session ? (
      <>
      <h2 className="border-b-[0.5px] pb-1 heading-2">Username</h2>
      <div className="flex mb-4">
        
        <label htmlFor=""></label>
        <input type="text" className="rounded-md p-1"/>
        <button className="rounded-md ml-4 h-10 w-16 bg-light">Set</button>
      </div>
      <h2 className="border-b-[0.5px] pb-1 mt-2 heading-2">Reset Account</h2>
      <div className="flex flex-col mb-4 gap-2">
        <p>Clear your stats and game history</p>
        <button className="rounded-md h-10 w-28 bg-light">Reset Stats</button>
      </div>
      <h2 className="border-b-[0.5px] pb-1 mt-2 heading-2">Delete Account</h2>
      <div className="flex flex-col mb-4 gap-2">
        <p>Want to delete your account? Note: This action can not be redone</p>
        <button className="rounded-md h-10 w-32 bg-light" onClick={() => deleteUser(session.user?.email)}>Delete Account</button>
      </div>
        <p>{session.user?.name}</p>
        <p>{session.user?.email}</p>
      </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-4">
            <h2 className="border-b-[0.5px] pb-1 heading-2">You are not signed in</h2>
            <button className="rounded-md h-10 px-4 bg-light">Create a new account</button>
            <p>or</p>
            <button className="rounded-md h-10 px-4 bg-light" >Sign in</button>
          </div>
        </>
        )}
    </div>
  </div>
  )
};

export default settings;
