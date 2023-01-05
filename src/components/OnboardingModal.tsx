import { HiX } from "react-icons/hi";
import Image from "next/image";

const OnboardingModal = ({ title, onClick, textOne, textTwo, image, alt }) => {
  return (
    <div className="absolute flex flex-col w-2/3 p-8 space-y-4 justify-evenly md:w-1/2 rounded-xl bg-lightest dark:bg-dark">
      <div className="flex justify-between">
        <h1 className="heading-1">{title}</h1>
        <button className="heading-1" onClick={onClick}>
          <HiX />
        </button>
      </div>
      <p>{textOne}</p>
      <div className="relative">
        <Image src={image} alt={alt} width={300} height={300} />
      </div>
      <p>{textTwo}</p>
    </div>
  );
};

export default OnboardingModal;
