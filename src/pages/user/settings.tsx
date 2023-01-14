import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import ProfilePicModal from "../../components/ProfilePicModal";
import UserInfoModal from "../../components/UserInfoModal";
import LoadingIcon from "../../components/LoadingIcon";

const Settings = () => {
  const { data: session, status } = useSession();
  const [userInfo, setUserInfo] = useState([]);
  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [userDob, setUserDob] = useState("");
  const [myUser, setMyUser] = useState([]);
  const [changeProfilePic, showProfileModal] = useState(false);
  const [changeInfo, showInfoModal] = useState(false);
  const [pPic, setProfilePic] = useState(
    "https://res.cloudinary.com/diczrtchl/image/upload/v1673611647/figma-profile-pics/a5gyee4oj1tlk9edfzlv.png"
  );

  const nameUser = myUser[0]?.["name"];
  const imageUser =
    myUser[0]?.["image"] ||
    "https://res.cloudinary.com/diczrtchl/image/upload/v1673611647/figma-profile-pics/a5gyee4oj1tlk9edfzlv.png";
  const userSession = session?.user;
  const userId = session?.user?.["id"];
  const userEmail = session?.user?.["email"];

  const user = session?.user;
  const profilePic = session?.user?.["image"];
  const noUserPic =
    "https://res.cloudinary.com/diczrtchl/image/upload/v1673611647/figma-profile-pics/a5gyee4oj1tlk9edfzlv.png";

  useEffect(() => {
    readUserInfo();
    readUser();
  }, [session]);
  useEffect(() => {
    if (imageUser !== null) {
      setProfilePic(imageUser);
    } else {
      setProfilePic(noUserPic);
    }
  }, [myUser]);
  useEffect(() => {
    if (userLocation === "") {
      setUserLocation(userInfo[0]?.["userLocation"]);
    }
    if (userName === "") {
      setUserName(userInfo[0]?.["username"]);
    }
    if (userDob === "") {
      setUserDob(userInfo[0]?.["userDob"]);
    }
  }, [userInfo]);

  const readUserInfo = async () => {
    try {
      const response = await fetch(`/api/userinfo`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const allUserInfo = await response.json();
      const info = allUserInfo.filter(
        (i: number) => i["userEmail"] === userEmail
      );
      setUserInfo(info);
      return info;
    } catch (error) {
      console.log("There was an error reading from the DB", error);
    }
  };
  const readUser = async () => {
    try {
      const response = await fetch(`/api/user`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const allUsers = await response.json();
      const info = allUsers.filter((i: number) => i["email"] === userEmail);
      setMyUser(info);
      return info;
    } catch (error) {
      console.log("There was an error reading from the DB", error);
    }
  };

  const deleteUser = async (e: any) => {
    try {
      const response = await fetch(`/api/user`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e),
      });
      signOut();

      // Redirect to home page ? //
    } catch (error) {
      console.log("There was an error deleting from the DB ", error);
    }
  };

  const deleteUserint = async () => {
    // console.log("here");
    try {
      const response = await fetch(`/api/single-tournament`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      // Redirect to home page ? //
      console.log(await response.json());
    } catch (error) {
      console.log("There was an error deleting from the DB ", error);
    }
  };

  const deleteStats = async (e: any) => {
    try {
      const response = await fetch(`/api/wordle-stats`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e),
      });
      const response2 = await fetch(`/api/quordle-stats`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e),
      });
    } catch (error) {
      console.log("There was an error in deleting from the DB", error);
    }
  };
  if (status === "loading") return <LoadingIcon />;

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="my-10 heading-1">Settings</h1>
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 w-full p-6 rounded-md">
        {session ? (
          <>
            {changeProfilePic && (
              <ProfilePicModal onClick={() => showProfileModal(false)} />
            )}
            {changeInfo && (
              <UserInfoModal
                onClick={() => showInfoModal(false)}
                userInfo={userInfo}
              />
            )}
            <div className="col-span-2">
              <h1 className="heading-1 text-center">
                Hey {session.user?.name}
              </h1>
            </div>
            <div className="grid col-start-2 row-start-2 justify-center p-4">
              <div className="flex flex-col gap-6">
                <div className=" rounded-full h-56 w-56  overflow-hidden shadow-lg">
                  <Image
                    src={pPic}
                    width={400}
                    height={400}
                    alt="image"
                    priority
                  />
                </div>
                <button
                  className="btn-primary w-1/2 self-center"
                  onClick={() => showProfileModal(true)}
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="grid col-start-1 row-start-2 bg-white dark:bg-darker shadow-md rounded-md p-4">
              <h2 className="border-b-[0.5px] pb-1 heading-2">About Me</h2>
              <div className="flex flex-col justify-evenly">
                <p className="text-xs ml-1 mt-2">Name</p>
                <p className="bg-gray-100 dark:bg-dark p-2 mb-1 h-10 rounded-md ">
                  {userInfo[0]?.["username"]}
                </p>
                <p className="text-xs ml-1">Location</p>
                <p className="bg-gray-100 dark:bg-dark p-2 mb-1 h-10 rounded-md ">
                  {userInfo[0]?.["userLocation"]}
                </p>
                <p className="text-xs ml-1">Date of Birth</p>
                <p className="bg-gray-100 dark:bg-dark p-2 mb-1 h-10 rounded-md ">
                  {userInfo[0]?.["userDob"]}
                </p>
                <button
                  className="btn-primary mt-3"
                  onClick={() => showInfoModal(true)}
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-darker shadow-md rounded-md p-4">
              <h2 className="border-b-[0.5px] pb-1 mt-2 heading-2">
                Reset Account
              </h2>
              <div className="flex flex-col gap-2 mb-4">
                <p className="text-sm">Clear your stats and game history</p>
                <button
                  className="btn-secondary w-2/3"
                  onClick={() => deleteStats(userEmail)}
                >
                  Reset Stats
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-darker shadow-md rounded-md p-4">
              <h2 className="border-b-[0.5px] pb-1 mt-2 heading-2">
                Delete Account
              </h2>
              <div className="flex flex-col mb-4">
                <p className="text-sm">Want to delete your account?</p>
                <p className="text-xs"> Note: This action can not be redone</p>
                <button
                  className="btn-secondary w-2/3 mt-2"
                  onClick={() => deleteUser(userEmail)}
                >
                  Delete Account
                </button>
              </div>
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

export default Settings;
