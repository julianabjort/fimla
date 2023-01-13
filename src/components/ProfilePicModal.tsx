import { HiX } from "react-icons/hi";
import Image from "next/image";
import { getSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const ProfilePicModal = () => {
  const [session, setSession] = useState();
  const [name, setName] = useState("");
  const [userEmail, setEmail] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [uploadData, setUploadData] = useState();

  /* Session */
  const readUser = async () => {
    const session = await getSession();
    const email = session?.user?.email || "";
    const image = session?.user?.image || "";
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
    <div className="absolute left-0 right-0 m-auto mt-20 flex flex-col w-2/3 p-8 space-y-4 justify-evenly items-center md:w-1/2 rounded-xl bg-lightest dark:bg-dark">
      <div className="flex justify-between">
        <h1 className="heading-1">Upload your profile image!</h1>
      </div>

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
      >
        <input type="file" name="file" />
        {imageSrc && !uploadData && <button>Upload</button>}
      </form>
      {imageSrc && uploadData && (
        <button className="btn-primary" onClick={() => updateProfilePic()}>
          Upload Profile Picture
        </button>
      )}
    </div>
  );
};

export default ProfilePicModal;
{
  /* <div className="absolute bg-red-500">
              <h2 className="border-b-[0.5px] pb-1 mt-2 heading-2">
                Upload your profile image
              </h2>
              <div className="bg-black rounded-full h-24 w-24 overflow-hidden">
                <Image
                  width={100}
                  height={100}
                  alt="img"
                  src="https://res.cloudinary.com/diczrtchl/image/upload/v1673553566/figma-profile-pics/s40sicdv5cn00hwuncsi.jpg"
                />
              </div>
              <form
                id="formId"
                action="#"
                method="POST"
                onChange={handleOnChange}
                onSubmit={handleOnSubmit}
              >
                <input type="file" name="file" />
                {imageSrc && !uploadData && <button>Upload</button>}
                {imageSrc && uploadData && (
                  <>
                    <div className="bg-black rounded-full h-24 w-24 overflow-hidden">
                      <Image
                        width={100}
                        height={100}
                        alt="img"
                        src={imageSrc}
                      />
                    </div>
                    <button onClick={() => updateProfilePic()}>
                      Upload Profile Picture
                    </button>
                  </>
                )}
              </form>
            </div> */
}
