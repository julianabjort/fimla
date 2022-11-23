import words from "../data/words.json";

export default {
  letters: [],
  vowels: "eyuioa",
  consonants: "qwrtpsdfghjklzxcvbnm",

  shuffleLetters(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  },

  get randomLetters() {
    return this.shuffleLetters(this.vowels, 3).concat(
      this.shuffleLetters(this.consonants, 4)
    );
  },

  startGame() {
    this.letters = this.randomLetters;
  },
};
