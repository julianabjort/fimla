import React from "react";

const SpellingBeeGrid = ({ letters }) => {
  return (
    <div className="flex">
      {letters.map((letter, i) => (
        <div className="flex w-10 h-10 bg-dark center" key={i}>
          {letter}
        </div>
      ))}
    </div>
  );
};

export default SpellingBeeGrid;
