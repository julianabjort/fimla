import React from "react";

const Keyboard = () => {
  const keyboard = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  return (
    <div className="my-8">
      {keyboard.map((row) => (
        <div className="flex my-1 center">
          {row.split("").map((key) => (
            <div className="flex w-10 h-12 mx-1 capitalize rounded-md center bg-light text-background">
              {key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
