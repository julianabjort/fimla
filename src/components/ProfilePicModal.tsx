import { HiX, HiOutlineDocumentAdd } from "react-icons/hi";
import Image from "next/image";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const ProfilePicModal = ({ onClick }) => {
  const [session, setSession] = useState();
  const [name, setName] = useState("");
  const [isFile, setFile] = useState(false);
  const [userEmail, setEmail] = useState("");
  const [imageSrc, setImageSrc] = useState(
    "https://res.cloudinary.com/diczrtchl/image/upload/v1673611647/figma-profile-pics/a5gyee4oj1tlk9edfzlv.png"
  );
  const [uploadData, setUploadData] = useState();

  /* Session */
  const readUser = async () => {
    const session = await getSession();
    const email = session?.user?.email || "";
    const image =
      session?.user?.image ||
      "https://res.cloudinary.com/diczrtchl/image/upload/v1673611647/figma-profile-pics/a5gyee4oj1tlk9edfzlv.png";
    setEmail(email);
    setImageSrc(image);
  };

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
  /*******************************/

  useEffect(() => {
    readUser();
  }, []);
  return (
    <div className="absolute left-0 shadow-xl right-0 m-auto flex flex-col w-4/5 p-8 space-y-4 justify-evenly items-center lg:w-2/3 rounded-xl bg-lightest dark:bg-dark">
      <div className="flex justify-between">
        <h1 className="heading-1">Profile Picture</h1>
        <button className="heading-1" onClick={onClick}>
          <HiX />
        </button>
      </div>
      <p>Update your profile picture here!</p>

      <div className="bg-black rounded-full h-24 w-24 overflow-hidden">
        <Image width={100} height={100} alt="img" src={imageSrc} />
      </div>

      <form
        id="formId"
        action="#"
        method="POST"
        onChange={handleOnChange}
        // onChange={handleOnSubmit}
        onSubmit={handleOnSubmit}
        className="flex flex-col items-center gap-4"
      >
        <label htmlFor="file">
          <input
            type="file"
            name="file"
            id="file"
            hidden
            value=""
            onChange={(e) => {
              const { target } = e;
              if (target.value.length > 0) {
                setFile(true);
              } else {
                setFile(false);
              }
            }}
          />
          <HiOutlineDocumentAdd className="text-4xl cursor-pointer" />
        </label>
        {isFile ? (
          <button className="btn-secondary">Choose</button>
        ) : (
          <button className="btn-secondary-dis">Choose</button>
        )}
        {imageSrc && uploadData ? (
          <button
            className="btn-primary"
            onClick={() => {
              updateProfilePic();
            }}
          >
            Upload Profile Picture
          </button>
        ) : (
          <button className="btn-primary-dis" disabled>
            Upload Profile Picture
          </button>
        )}
      </form>
    </div>
  );
};

export default ProfilePicModal;
