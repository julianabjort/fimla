import { useEffect, useState } from "react";

const wordle = () => {
  const [guess, setGuess] = useState<Array<string>>([]);

  useEffect(() => {
    const handleKeyDown = ({ key }: { key: string }) => {
      if (guess.length < 5) {
        const character = /^[a-z]$/.test(key);
        if (character) {
          setGuess((prev) => [...prev, key]);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [guess.length]);
  console.log(guess);
  return (
    <div>
      <h1 className="heading-1">Wordle</h1>
    </div>
  );
};

export default wordle;
