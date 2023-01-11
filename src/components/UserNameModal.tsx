import { HiX } from "react-icons/hi";
import Image from "next/image";
import { getSession, signOut } from "next-auth/react";
import { useState } from "react";

const UserNameModal = () => {
  const [session, setSession] = useState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const readUser = async () => {
    const session = await getSession();
    // console.log("layout session", session);
    const email = session?.user?.email || "";
    setEmail(email);
  };
  const updateUser = async () => {
    const body = { name, email };
    console.log(body);
    try {
      const response = fetch(`/api/user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log(response);
    } catch (error) {
      console.log("There was an error deleting from the DB ", error);
    }
    signOut();
  };
  readUser();
  return (
    <div className="absolute left-0 right-0 m-auto mt-20 flex flex-col w-2/3 p-8 space-y-4 justify-evenly items-center md:w-1/2 rounded-xl bg-lightest dark:bg-dark">
      <div className="flex justify-between">
        <h1 className="heading-1">Welcome to Fimla!</h1>
      </div>
      <p>Before you start playing, tell us your name!</p>
      <form
        className="flex flex-col mb-4"
        action="#"
        method="PUT"
        onSubmit={() => updateUser()}
      >
        <label htmlFor="name">Full name</label>
        <input
          onChange={(e) => setName(e.target.value)}
          name="name"
          id="name"
          type="text"
          className="p-1 mb-5 rounded-md"
        />
        <button className="btn-primary mb-4">Enter</button>
        <p className="text-xs">
          Note: You will need to sign in again after this action.
        </p>
      </form>
      <div className="relative">
        {/* <Image src="/how-to-sb.png" alt="img" width={300} height={300} /> */}
      </div>
    </div>
  );
};

export default UserNameModal;
