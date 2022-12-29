import fourLetterWords from "../data/fourLetterWords.json";
import fiveLetterWords from "../data/fiveLetterWords.json";
import sixLetterWords from "../data/sixLetterWords.json";

export default {
  letters: [],
  fourLetterWords: [],
  fiveLetterWords: [],
  sixLetterWords: [],
  sevenLetterWords: [],
  word: "",
  numberOfGuesses: 0,
  vowels: "eyuioa",
  consonants: "qwrtpsdfghjklcvbnm",
  error: "",

  // FUNCTIONS

  getRandomLetters(arr, num) {
    const letters = [...arr].sort(() => 0.5 - Math.random());
    return letters.slice(0, num);
  },

  shuffle(letters) {
    letters.sort(() => 0.5 - Math.random());
    this.letters = letters;
  },

  startGame() {
    this.letters = this.randomLetters;
    this.fourLetterWords = [];
    this.fiveLetterWords = [];
    this.sixLetterWords = [];
    this.error = "";
  },

  submitWord() {
    this.error = "";
    if (fourLetterWords.includes(this.word)) {
      this.fourLetterWords.push(this.word);
    } else if (fiveLetterWords.includes(this.word)) {
      this.fiveLetterWords.push(this.word);
    } else if (sixLetterWords.includes(this.word)) {
      this.sixLetterWords.push(this.word);
    } else {
      this.error = "Invalid word";
    }
  },

  allLetterCombos(letters, length) {
    return Array.from({ length })
      .fill(letters)
      .reduce((a, b) =>
        a.reduce((r, v) => r.concat(b.map((w) => [].concat(v, w))), [])
      )
      .map((a) => a.join(""));
  },

  handleKeydown(e) {
    if (e.key === "Backspace") {
      this.error = "";
    } else if (!this.letters.includes(e.key)) {
      this.error = "bad letter";
    }
    if (e.key === "Enter") {
      return this.submitWord();
    }
  },

  // COMPUTED PROPERTIES

  get allFourLetterWords() {
    return this.allLetterCombos(this.letters, 4).filter((combo) =>
      fourLetterWords.some((word) => combo === word)
    );
  },

  get allFiveLetterWords() {
    return this.allLetterCombos(this.letters, 5).filter((combo) =>
      fiveLetterWords.some((word) => combo === word)
    );
  },

  get allSixLetterWords() {
    return this.allLetterCombos(this.letters, 6).filter((combo) =>
      sixLetterWords.some((word) => combo === word)
    );
  },

  get randomLetters() {
    return this.getRandomLetters(this.vowels, 3).concat(
      this.getRandomLetters(this.consonants, 4)
    );
  },
};
