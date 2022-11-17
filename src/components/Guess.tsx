const Guess = ({
  word,
  guess,
  isGuessed,
}: {
  word: string;
  guess: string;
  isGuessed: boolean;
}) => {
  return (
    <div className="grid w-auto grid-cols-5">
      {new Array(5).fill(0).map((_, i) => {
        const bgColor = !isGuessed
          ? "bg-lighter dark:bg-dark"
          : guess[i] === word[i]
          ? "bg-green-400"
          : word.includes(guess[i])
          ? "bg-yellow-400"
          : "bg-lighter dark:bg-dark";
        return (
          <div
            key={i}
            className={`flex w-12 mx-1 my-1 text-4xl capitalize rounded-md aspect-square ${bgColor} center`}
          >
            {guess[i]}
          </div>
        );
      })}
    </div>
  );
};

export default Guess;
