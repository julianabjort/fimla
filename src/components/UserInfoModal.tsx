import { HiX } from "react-icons/hi";
import { useState } from "react";
import { useSession } from "next-auth/react";

const UserInfoModal = ({ onClick, userInfo }) => {
  const { data: session } = useSession();

  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [userDob, setUserDob] = useState("");

  const userEmail = session?.user?.["email"];

  const updateUserInfo = async (e: any): Promise<any> => {
    e.preventDefault();
    const body = { userEmail, userName, userDob, userLocation };
    if (userInfo[0]) {
      try {
        const response = fetch(`/api/userinfo`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } catch (error) {
        console.log("There was an error deleting from the DB ", error);
      }
    } else {
      try {
        const response = fetch(`/api/userinfo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } catch (error) {
        console.log("There was an error deleting from the DB ", error);
      }
    }
    window.location.reload();
  };

  return (
    <div className="absolute flex flex-col w-2/3 shadow-xl left-0 right-0 m-auto p-8 space-y-4 justify-evenly md:w-1/2 rounded-xl bg-lightest dark:bg-dark">
      <div className="flex justify-between">
        <h1 className="heading-1">Information</h1>
        <button className="heading-1" onClick={onClick}>
          <HiX />
        </button>
      </div>
      <form
        className="flex flex-col mb-4"
        action="#"
        method="POST"
        onSubmit={(e) => updateUserInfo(e)}
      >
        <label htmlFor="username">What is your favourite nickname?</label>
        <input
          onChange={(e) => setUserName(e.target.value)}
          name="username"
          id="username"
          type="text"
          className="p-1 mb-5 rounded-md"
        />
        {userInfo[0]?.["username"]}
        <label htmlFor="userLocation">
          Tell us where you are in the world!
        </label>
        <input
          onChange={(e) => setUserLocation(e.target.value)}
          name="userLocation"
          id="userLocation"
          type="text"
          className="p-1 mb-5 rounded-md"
        />
        <label htmlFor="userDob">Date of birth!</label>
        <input
          onChange={(e) => setUserDob(e.target.value)}
          name="userDob"
          id="userDob"
          type="date"
          className="p-1 mb-5 rounded-md"
        />
        <button className="btn-primary">Update</button>
      </form>
    </div>
  );
};

export default UserInfoModal;
