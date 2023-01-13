import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { render } from "react-dom";
import { AnyRecord } from "dns";
import { profile } from "console";
import ProfilePicModal from "../../components/ProfilePicModal";

const Settings = () => {
  const { data: session } = useSession();
  const [userInfo, setUserInfo] = useState([]);
  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [userDob, setUserDob] = useState("");
  const [myUser, setMyUser] = useState([]);
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();
  const [changeProfilePic, showProfileModal] = useState(false);

  const nameUser = myUser[0]?.["name"];
  const imageUser = myUser[0]?.["image"];
  const userSession = session?.user;
  const userId = session?.user?.["id"];
  const userEmail = session?.user?.["email"];
  const user = session?.user;
  const profilePic = session?.user?.["image"];
  const noUserPic =
    "https://res.cloudinary.com/diczrtchl/image/upload/v1673611647/figma-profile-pics/a5gyee4oj1tlk9edfzlv.png";

  /* UPLOAD IMAGES TO CLOUDINARY */
  const handleOnChange = (changeEvent: any) => {
    const reader = new FileReader();
    reader.onload = function (onLoadEvent: any) {
      setImageSrc(onLoadEvent.target?.result);
      setUploadData(undefined);
    };
    reader.readAsDataURL(changeEvent.target.files?.[0]);
  };

  const handleOnSubmit = async (event: any) => {
    event.preventDefault();
    // const form = document.getElementById("formId") as HTMLFormElement;
    const form = event.currentTarget;
    const fileInput: any = Array.from(form.elements).find(
      ({ name }: any) => name === "file"
    );

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }
    formData.append("upload_preset", "figma-profile-pics");
    const data = await fetch(
      "https://api.cloudinary.com/v1_1/diczrtchl/image/upload",
      { method: "POST", body: formData }
    ).then((response) => response.json());

    setImageSrc(data.secure_url);
    setUploadData(data);
  };

  /*******************************/

  useEffect(() => {
    readUserInfo();
    readUser();
  }, [session]);
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

    console.log(imageUser);
  }, [userInfo, myUser]);

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
  const updateProfilePic = async () => {
    const body = { userEmail, imageSrc };
    console.log(body);
    try {
      const response = fetch(`/api/profile-pic`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log(response);
    } catch (error) {
      console.log("There was an error deleting from the DB ", error);
    }
  };
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
    console.log("here");
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
  useEffect(() => {}, [session]);
  useEffect(() => {
    console.log("hey", profilePic);
  }, [profilePic]);

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="my-10 heading-1">Settings</h1>
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6 w-full p-6 rounded-md bg-lighter dark:bg-darker">
        {session ? (
          <>
            {changeProfilePic && <ProfilePicModal />}
            <div className="col-span-2">
              <h1 className="mb-10 heading-1 text-center">
                Hey {session.user?.name}
              </h1>
            </div>
            <div className="grid col-start-2 row-start-2 justify-center">
              <div className="flex flex-col gap-6">
                <div className=" rounded-full h-56 w-56  overflow-hidden">
                  {imageUser ? (
                    <Image width={390} height={390} alt="img" src={imageUser} />
                  ) : (
                    <Image width={400} height={400} alt="img" src={noUserPic} />
                  )}
                </div>
                <button
                  className="btn-primary"
                  onClick={() => showProfileModal(true)}
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="grid col-start-1 row-start-2">
              <h2 className="border-b-[0.5px] pb-1 heading-2">
                User Information
              </h2>
              <div className="flex flex-col self-end">
                <p className="text-xs ml-1 mt-2">Name</p>
                <p className="bg-gray-100 p-2 mb-1 rounded-md ">
                  {userInfo[0]?.["username"]}Lubba
                </p>
                <p className="text-xs ml-1">Location</p>
                <p className="bg-gray-100 p-2 mb-1 rounded-md ">
                  {userInfo[0]?.["userLocation"]}Copenhagen
                </p>
                <p className="text-xs ml-1">Date of Birth</p>
                <p className="bg-gray-100 p-2 mb-1 rounded-md ">
                  {userInfo[0]?.["userDob"]}23.05.1995
                </p>
                <button className="btn-primary mt-3">Edit</button>
              </div>
              {/* <div className="flex mb-4">
                <form
                  className="flex flex-col mb-4"
                  action="#"
                  method="POST"
                  onSubmit={(e) => updateUserInfo(e)}
                >
                  <label htmlFor="username">
                    What is your favourite nickname? {userInfo[0]?.["username"]}
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
                    {userInfo[0]?.["userLocation"]}
                  </label>
                  <input
                    onChange={(e) => setUserLocation(e.target.value)}
                    name="userLocation"
                    id="userLocation"
                    type="text"
                    className="p-1 mb-5 rounded-md"
                  />
                  <label htmlFor="userDob">
                    Date of birth! {userInfo[0]?.["userDob"]}
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
              </div> */}
            </div>
            <div>
              <h2 className="border-b-[0.5px] pb-1 mt-2 heading-2">
                Reset Account
              </h2>
              <div className="flex flex-col gap-2 mb-4">
                <p className="text-sm">Clear your stats and game history</p>
                <button
                  className="btn-primary w-2/3"
                  onClick={() => deleteStats(userEmail)}
                >
                  Reset Stats
                </button>
              </div>
            </div>
            <div className="row-start-4">
              <h2 className="border-b-[0.5px] pb-1 mt-2 heading-2">
                Delete Account
              </h2>
              <div className="flex flex-col mb-4">
                <p className="text-sm">Want to delete your account?</p>
                <p className="text-xs"> Note: This action can not be redone</p>
                <button
                  className="btn-primary w-2/3 mt-2"
                  // onClick={() => deleteUser(userEmail)}
                  onClick={() => deleteUserint()}
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
