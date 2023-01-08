import { observer } from "mobx-react-lite";

const Keyboard = ({ store }: any) => {
  const keyboard = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  const enterAndDelete = ["enter", "delete"];
  return (
    <div className="my-8">
      {keyboard.map((row, i) => (
        <div key={i} className="flex my-1 center">
          {row.split("").map((key, i) => {
            const bgColor = store.greenLetters.includes(key)
              ? "bg-green"
              : store.yellowLetters.includes(key)
              ? "bg-yellow"
              : store.allGuessedLetters.includes(key)
              ? "bg-medium dark:bg-dark dark:text-white"
              : "bg-lighter";
            return (
              <div
                onClick={() => store.handleKeyClick(key)}
                key={i}
                className={`flex w-8 md:w-10 h-10 md:h-12 mx-0.5 md:mx-1 cursor-pointer capitalize rounded-md center ${bgColor} text-background`}
              >
                {key}
              </div>
            );
          })}
        </div>
      ))}
      <div className="flex gap-x-2 center">
        {enterAndDelete.map((key, i) => (
          <div
            className="w-1/3 py-2 text-center rounded-lg cursor-pointer bg-lighter dark:text-dark"
            key={i}
            onClick={() => store.handleKeyClick(key)}
          >
            {key}
          </div>
        ))}
      </div>
    </div>
  );
};

export default observer(Keyboard);
