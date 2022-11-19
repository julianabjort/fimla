import { observer } from "mobx-react-lite";

const Keyboard = ({ store }) => {
  const keyboard = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  return (
    <div className="my-8">
      {keyboard.map((row, i) => (
        <div key={i} className="flex my-1 center">
          {row.split("").map((key, i) => {
            const bgColor = store.greenLetters.includes(key)
              ? "bg-green-400"
              : store.yellowLetters.includes(key)
              ? "bg-yellow-400"
              : store.allGuessedLetters.includes(key)
              ? "bg-dark"
              : "bg-light";
            return (
              <div
                onClick={() => store.handleKeyClick(key)}
                key={i}
                className={`flex w-10 h-12 mx-1 cursor-pointer capitalize rounded-md center ${bgColor} text-background`}
              >
                {key}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default observer(Keyboard);
