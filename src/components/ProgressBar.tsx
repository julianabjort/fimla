import React from "react";

const ProgressBar = ({ progressPercentage }) => {
  return (
    <div className="w-full h-8 my-4 bg-white rounded-lg dark:bg-light">
      <div
        style={{ width: `${progressPercentage}%` }}
        className={`h-full rounded-l-lg ${
          progressPercentage < 70 ? "bg-purple-400" : "bg-green-400"
        }`}
      ></div>
    </div>
  );
};

export default ProgressBar;
