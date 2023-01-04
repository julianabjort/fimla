import fourLetterWords from "../data/fourLetterWords.json";
import fiveLetterWords from "../data/fiveLetterWords.json";
import sixLetterWords from "../data/sixLetterWords.json";

export default {
  letters: [],
  fourLetterWords: [],
  fiveLetterWords: [],
  allFoundWords: [],
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
    this.sixLetterWords = [];
    this.error = "";
    console.log(this.allWords);
    console.log(this.progressPercentage);
  },

  submitWord() {
    this.error = "";
    if (
      this.fourLetterWords.includes(this.word) ||
      this.fiveLetterWords.includes(this.word)
    ) {
      this.error = "Already found";
    } else if (this.allFourLetterWords.includes(this.word)) {
      this.fourLetterWords.push(this.word);
      this.allFoundWords.push(this.word);
    } else if (this.allFiveLetterWords.includes(this.word)) {
      this.fiveLetterWords.push(this.word);
      this.allFoundWords.push(this.word);
    } else {
      this.error = "Invalid word";
    }
  },

  allLetterCombos(letters, length) {
    return Array.from({ length })
      .fill(letters)
      .reduce((a, b) =>
        a.reduce((c, d) => c.concat(b.map((e) => [].concat(d, e))), [])
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

  get allWords() {
    return this.allFourLetterWords.concat(this.allFiveLetterWords);
  },

  get progressPercentage() {
    return (this.allFoundWords.length / this.allWords.length) * 100;
  },

  get randomLetters() {
    return this.getRandomLetters(this.vowels, 3).concat(
      this.getRandomLetters(this.consonants, 4)
    );
  },
};
