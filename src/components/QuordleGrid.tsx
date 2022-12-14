const QuordleGrid = ({
  word1,
  guess,
  isGuessed,
  won,
}: {
  word1: string;
  won: boolean;
  guess: string;
  isGuessed: boolean;
}) => {
  return (
    <div className="grid w-auto grid-cols-5">
      {new Array(5).fill(0).map((_, i) => {
        const bgColor = !isGuessed
          ? "bg-lighter dark:bg-dark"
          : guess[i] === word1[i]
          ? "bg-green"
          : word1.includes(guess[i])
          ? "bg-yellow"
          : "bg-lighter dark:bg-dark";
        const height = !isGuessed && !won && guess ? "h-10" : "h-5";

        return (
          <div
            key={i}
            className={`${height} flex w-12 mx-1 my-1 items-center justify-center rounded-md uppercase aspect-square ${bgColor}`}
          >
            {guess[i]}
          </div>
        );
      })}
    </div>
  );
};

export default QuordleGrid;
