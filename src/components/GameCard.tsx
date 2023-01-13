import React from "react";

const GameCard = ({ image, title }) => {
  return (
    <div className="flex flex-col justify-between w-full transition ease-in-out bg-white shadow-md dark:bg-dark rounded-3xl hover:scale-[1.01]">
      <img className="w-full rounded-t-xl" src={image} alt="" />
      <div className="flex items-center justify-between m-6 md:m-2 lg:m-6 md:flex-col lg:flex-row">
        <h1 className="text-3xl md:text-2xl lg:text-3xl">{title}</h1>
        <button className="transition ease-in-out btn-secondary md:px-10 lg:px-4 md:my-2 lg:my-0 hover:shadow-md">
          play
        </button>
      </div>
    </div>
  );
};

export default GameCard;
