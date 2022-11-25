import fiveLetterWords from "../data/fiveLetterWords.json";
import fourLetterWords from "../data/fourLetterWords.json";

export default {
  letters: [],
  fourLetterWords: [],
  fiveLetterWords: [],
  word: "",
  numberOfGuesses: 0,
  vowels: "eyuioa",
  consonants: "qwrtpsdfghjklcvbnm",
  error: "",

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
    this.error = "";
  },

  submitWord() {
    this.error = "";
    if (fourLetterWords.includes(this.word)) {
      this.fourLetterWords.push(this.word);
    } else if (fiveLetterWords.includes(this.word)) {
      this.fiveLetterWords.push(this.word);
    } else {
      this.error = "Invalid word";
    }
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

  get randomLetters() {
    return this.getRandomLetters(this.vowels, 3).concat(
      this.getRandomLetters(this.consonants, 4)
    );
  },
};
