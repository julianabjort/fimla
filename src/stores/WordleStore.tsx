import words from "../data/words.json";
export default {
  error: "",
  word: "",
  guesses: [],
  numberOfGuesses: 0,

  get won() {
    return this.guesses[this.numberOfGuesses - 1] === this.word;
  },
  get lost() {
    return this.numberOfGuesses === 6;
  },

  // Array with all the letters that have been guessed
  get allGuessedLetters() {
    return this.guesses.slice(0, this.numberOfGuesses).join("").split("");
  },

  // Array of the green letters - correct letters guessed in the right position
  get greenLetters() {
    return this.word.split("").filter((letter, i) => {
      return this.guesses
        .slice(0, this.numberOfGuesses)
        .map((word) => word[i])
        .includes(letter);
    });
  },

  // Array of yellow letters - correct letters in wrong position
  get yellowLetters() {
    return this.word
      .split("")
      .filter((letter) => this.allGuessedLetters.includes(letter));
  },

  startGame() {
    this.word = words[Math.round(Math.random() * words.length)];
    this.guesses.replace(new Array(6).fill(""));
    this.numberOfGuesses = 0;
  },
  submitGuess() {
    if (words.includes(this.guesses[this.numberOfGuesses])) {
      this.numberOfGuesses += 1;
    } else {
      this.error = "Not a valid word";
    }
  },

  handleKeyup(e) {
    if (this.won || this.lost) {
      return;
    }
    if (e.key === "Enter") {
      return this.submitGuess();
    }
    if (e.key === "Backspace") {
      this.guesses[this.numberOfGuesses] = this.guesses[
        this.numberOfGuesses
      ].slice(0, this.guesses[this.numberOfGuesses].length - 1);
      return;
    }

    if (
      this.guesses[this.numberOfGuesses].length < 5 &&
      e.key.match(/^[a-z]$/)
    ) {
      this.guesses[this.numberOfGuesses] =
        this.guesses[this.numberOfGuesses] + e.key.toLowerCase();
    }
  },

  handleKeyClick(key) {
    if (this.guesses[this.numberOfGuesses].length < 5) {
      this.guesses[this.numberOfGuesses] =
        this.guesses[this.numberOfGuesses] + key.toLowerCase();
    }
  },
};
