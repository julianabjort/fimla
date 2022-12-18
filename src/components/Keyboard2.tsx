import { observer } from "mobx-react-lite";

const Keyboard2 = ({ store }) => {
  const keyboard = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  const enterAndDelete = ["enter", "delete"];
  return (
    <div>
      {keyboard.map((row, i) => (
        <div key={i} className="flex my-1 center">
          {row.split("").map((key, i) => {
            const bgColor1 = store.greenLetters1.includes(key)
              ? "bg-green"
              : store.yellowLetters1.includes(key)
              ? "bg-yellow"
              : store.allGuessedLetters.includes(key)
              ? "bg-medium dark:bg-mediumdark dark:text-white"
              : "bg-lighter";
            const bgColor2 = store.greenLetters2.includes(key)
              ? "bg-green"
              : store.yellowLetters2.includes(key)
              ? "bg-yellow"
              : store.allGuessedLetters.includes(key)
              ? "bg-medium dark:bg-mediumdark dark:text-white"
              : "bg-lighter";
            const bgColor3 = store.greenLetters3.includes(key)
              ? "bg-green"
              : store.yellowLetters3.includes(key)
              ? "bg-yellow"
              : store.allGuessedLetters.includes(key)
              ? "bg-medium dark:bg-mediumdark dark:text-white"
              : "bg-lighter";
            const bgColor4 = store.greenLetters4.includes(key)
              ? "bg-green"
              : store.yellowLetters4.includes(key)
              ? "bg-yellow"
              : store.allGuessedLetters.includes(key)
              ? "bg-medium dark:bg-mediumdark dark:text-white"
              : "bg-lighter";
            return (
              <div
                onClick={() => store.handleKeyClick(key)}
                key={i}
                className={`grid grid-cols-2 w-12 h-12 mx-1 cursor-pointer capitalize rounded-md  text-background`}
              >
                <span className="absolute px-5 py-3">{key}</span>
                <div className={`${bgColor1} w-6 h-6 rounded-tl-md`}></div>
                <div className={`${bgColor2} w-6 h-6 rounded-tr-md`}></div>
                <div className={`${bgColor3} w-6 h-6 rounded-bl-md`}></div>
                <div className={`${bgColor4} w-6 h-6 rounded-br-md`}></div>
              </div>
            );
          })}
        </div>
      ))}
      <div className="flex gap-x-2 center">
        {enterAndDelete.map((key, i) => (
          <div
            className="w-1/3 py-2 text-center rounded-lg cursor-pointer bg-lighter"
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

export default observer(Keyboard2);
