import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

import ProfilePicModal from "../../components/ProfilePicModal";
import UserInfoModal from "../../components/UserInfoModal";
import LoadingIcon from "../../components/LoadingIcon";
import getByUserEmail from "../../../lib/getByUserEmail";
import deleteData from "../../../lib/deleteData";
import Link from "next/link";

const Settings = () => {
  const { data: session, status } = useSession();
  const userSession = session?.user;
  const userEmail = session?.user?.["email"];
  const [userInfo, setUserInfo] = useState([]);
  const [user, setUser] = useState([]);
  const [changeProfilePic, showProfilePicModal] = useState(false);
  const [changeInfo, showInfoModal] = useState(false);
  const [imageSrc, setImageSrcReady] = useState("");

  const defaultProfilePic =
    "https://res.cloudinary.com/diczrtchl/image/upload/v1673611647/figma-profile-pics/a5gyee4oj1tlk9edfzlv.png";

  const [profilePic, setProfilePic] = useState(
    "https://res.cloudinary.com/diczrtchl/image/upload/v1673611647/figma-profile-pics/a5gyee4oj1tlk9edfzlv.png"
  );
  const userImage =
    user?.["image"] ||
    "https://res.cloudinary.com/diczrtchl/image/upload/v1673611647/figma-profile-pics/a5gyee4oj1tlk9edfzlv.png";

  useEffect(() => {
    getUserInfo();
    getUser();
  }, [session]);

  useEffect(() => {
    if (userImage !== null) {
      setProfilePic(userImage);
    } else {
      setProfilePic(defaultProfilePic);
    }
  }, [user]);

  useEffect(() => {
    if (imageSrc) setProfilePic(imageSrc);
  }, [imageSrc]);

  const getUserInfo = async () => {
    getByUserEmail("userinfo", userSession).then((result) =>
      setUserInfo(result[0])
    );
  };

  const getUser = async () => {
    getByUserEmail("user", userSession).then((result) => setUser(result[0]));
  };

  const deleteUser = async (e: any) => {
    deleteData("user", e);
    signOut();
  };

  const deleteStats = async (e: any) => {
    deleteData("wordle-stats", e);
    deleteData("quordle-stats", e);
  };

  if (status === "loading") return <LoadingIcon isPage />;

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="my-10 heading-1">Settings</h1>
      <div className="flex flex-col w-full gap-6 p-6 rounded-md lg:grid lg:grid-cols-2">
        {session ? (
          <>
            {changeProfilePic && (
              <ProfilePicModal
                setImageSrcReady={setImageSrcReady}
                closeModal={() => showProfilePicModal(false)}
              />
            )}
            {changeInfo && (
              <UserInfoModal
                onClick={() => showInfoModal(false)}
                userInfo={userInfo}
              />
            )}
            <div className="col-span-2">
              <h1 className="text-center heading-1">
                Hey {session.user?.name}
              </h1>
            </div>
            <div className="grid justify-center col-start-2 row-start-2 p-4">
              <div className="flex flex-col gap-6">
                <div className="w-56 h-56 overflow-hidden rounded-full shadow-lg ">
                  <Image
                    src={profilePic}
                    width={400}
                    height={400}
                    placeholder="blur"
                    blurDataURL="/user.png"
                    alt="image"
                    priority
                  />
                </div>
                <button
                  className="self-center w-1/2 btn-primary"
                  onClick={() => showProfilePicModal(true)}
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="grid col-start-1 h-full row-start-2 p-4 bg-white rounded-md shadow-md dark:bg-darker">
              <h2 className="border-b-[0.5px] h-10 pb-1 heading-2">About Me</h2>
              <div className="flex flex-col">
                {userInfo?.["username"] !== null && (
                  <>
                    <p className="mt-2 ml-1 text-xs text-gray-400">Name</p>
                    <p className="h-10 p-2 mb-1">{userInfo?.["username"]}</p>
                  </>
                )}
                {userInfo?.["userLocation"] !== null && (
                  <>
                    <p className="ml-1 text-xs text-gray-400">Location</p>
                    <p className="h-10 p-2 mb-1">
                      {userInfo?.["userLocation"]}
                    </p>
                  </>
                )}
                {userInfo?.["userDob"] !== null && (
                  <>
                    <p className="ml-1 text-xs text-gray-400">Date of Birth</p>
                    <p className="h-10 p-2 mb-1">{userInfo?.["userDob"]}</p>
                  </>
                )}

                <button
                  className="flex mt-auto justify-center btn-primary "
                  onClick={() => showInfoModal(true)}
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="p-4 bg-white rounded-md shadow-md dark:bg-darker">
              <h2 className="border-b-[0.5px] pb-1 mt-2 heading-2">
                Reset Account
              </h2>
              <div className="flex flex-col gap-2 mb-4">
                <p className="my-1 text-sm">
                  Clear your stats and game history
                </p>
                <button
                  className="w-2/3 btn-secondary"
                  onClick={() => deleteStats(userEmail)}
                >
                  Reset Stats
                </button>
              </div>
            </div>
            <div className="p-4 bg-white rounded-md shadow-md dark:bg-darker">
              <h2 className="border-b-[0.5px] pb-1 mt-2 heading-2">
                Delete Account
              </h2>
              <div className="flex flex-col mb-4">
                <p className="my-1 text-sm">
                  Warning: this action cannot be undone
                </p>
                <button
                  className="w-2/3 mt-2 btn-secondary"
                  onClick={() => deleteUser(userEmail)}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col col-start-1 col-end-3 self-center justify-center p-6 rounded-md lg:mx-24 lg:p-10 bg-lightest dark:bg-darker">
              <div className="flex flex-col items-center gap-4">
                <h2 className="border-b-[0.5px] pb-1 heading-2">
                  Create your account in a few seconds
                </h2>
                <Link href="/api/auth/signin">
                  <button className="h-10 px-4 rounded-md bg-light dark:bg-dark">
                    Get started
                  </button>
                </Link>
                <div className="flex flex-col items-center">
                  <p className="text-xs">Already have an account?</p>
                  <Link className="text-xs" href="/api/auth/signin">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
