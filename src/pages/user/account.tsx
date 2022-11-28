import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useEffect } from "react";

const account = () => {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");

  const [users, setUsers] = useState(null);
  const [userInfo, setUserInfo] = useState("");
  
  useEffect(() => {
    console.log("users: ", users)
  },[users])
  // const [age, setAge] = useState("");

  const findUser = async() => {
    try{
      const response = await fetch(`/api/users`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
      });
      setUsers(await response.json());
    } catch(error){
      console.log("There was an error reading from the DB ", error)
    }
  }
  const newUsername = async(e:any) => {
    e.preventDefault();
    const user = session.user.email
    const score = 0;
    // if no userinfo then create
    const body = {user, username, score}
    try{
      const response = await fetch(`/api/user-stats`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
      });
      // if already is userinfo then update
    } catch(error){
      console.log("There was an error posting to the DB ", error)
    }
  }
  const readUserInfo = async() => {
    const user = session.user
    try{
      const response = await fetch(`/api/user-stats`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
      });
      console.log("RESPONSY", user)
      setUserInfo(await response.json());
      // console.log(userInfo[0].userEmail)
      if (user.email === "laaufey@gmail.com") {
        console.log("email")
      }
    } catch(error){
      console.log("There was an error reading from the DB ", error)
    }
  }
  const deleteUser = async(e:any) => {
    console.log("DELETE USER FUNCTION ", e)
    try{
      const response = await fetch(`/api/delete-user`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(e)
      });
      console.log("RESPONSY", response.json())
      signOut();
      // Redirect to home page ? //
    } catch(error){
      console.log("There was an error deleting from the DB ", error)
    }
  }

  const updateUserStats = async(e:any) => {
    console.log("DELETE USER STATS FUNCTION ", e)
    try{
      const response = await fetch(`/api/user-stats`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(e)
      });
      console.log("RESPONSY", response.json())
      // Redirect to home page ? //
    } catch(error){
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
        {/* {console.log(session.user)} */}


        
        <form action="#" method="POST" onSubmit={(e) => newUsername(e)}>
        <label htmlFor="user-name">Set a new username</label>
        <input type="text" onChange={(e) => setUsername(e.target.value)} name="user-name" id="user-name"/>
        {/* <label htmlFor="age">How old are you</label> */}
        {/* <input type="text" onChange={(e) => setAge(e.target.value)} name="age" id="age"/> */}
        <input type="submit" value="post" name="" id="" />
        </form>
        <button className="p-2 bg-white text-black rounded-md" onClick={() => findUser()}>Click</button>
        <button className="p-2 bg-white text-black rounded-md" onClick={() => deleteUser(session.user?.email)}>Delete account</button>
        <button onClick={() => readUserInfo()}>Stats</button>
        {users ? (
          <>
          <p>Hello yes</p>
          <p>{users[2].newUsername}</p>
          
          </>
        ):(
          <p>Nothing</p>
        )}
      </>
      ) : (
        <p>Not signed in</p>
        )}
    </div>
  </div>
  );
};

export default account;
