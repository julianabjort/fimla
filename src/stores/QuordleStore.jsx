import words from "../data/fiveLetterWords.json";

export default {
  error: "",
  word1: "",
  word2: "",
  word3: "",
  word4: "",
  guesses: [],
  guesses2: [],
  guesses3: [],
  guesses4: [],
  currentGuess: 0,
  currentGuess2: 0,
  currentGuess3: 0,
  currentGuess4: 0,
  totalScore: 0,

  get won1() {
    return this.guesses[this.currentGuess - 1] === this.word1;
  },
  get won2() {
    return this.guesses2[this.currentGuess2 - 1] === this.word2;
  },
  get won3() {
    return this.guesses3[this.currentGuess3 - 1] === this.word3;
  },
  get won4() {
    return this.guesses4[this.currentGuess4 - 1] === this.word4;
  },
  get wonAll() {
    return this.won1 && this.won2 && this.won3 && this.won4;
  },
  get lost() {
    return this.wonAll === false && this.currentGuess === 9;
  },
  get roundComplete() {
    return this.wonAll || this.currentGuess === 9;
  },
  get allGuessedLetters() {
    const guessed = (guesses, currentGuess) =>
      guesses.slice(0, currentGuess).join("").split("");
    const guessed1 = guessed(this.guesses, this.currentGuess);
    const guessed2 = guessed(this.guesses2, this.currentGuess2);
    const guessed3 = guessed(this.guesses3, this.currentGuess3);
    const guessed4 = guessed(this.guesses4, this.currentGuess4);
    return [...guessed1, ...guessed2, ...guessed3, ...guessed4];
  },

  get correctLetters() {
    const findCorrectLetters = (allGuessedLetters, word) =>
      allGuessedLetters.filter((letter1) =>
        word.split("").some((letter2) => letter1 === letter2)
      );
    const word1 = findCorrectLetters(this.allGuessedLetters, this.word1);
    const word2 = findCorrectLetters(this.allGuessedLetters, this.word2);
    const word3 = findCorrectLetters(this.allGuessedLetters, this.word3);
    const word4 = findCorrectLetters(this.allGuessedLetters, this.word4);
    return [...word1, ...word2, ...word3, ...word4];
  },

  // Array of the green letters - correct letters guessed in the right position
  get greenLetters1() {
    return this.word1.split("").filter((letter, i) => {
      return this.guesses
        .slice(0, this.currentGuess)
        .map((word1) => word1[i])
        .includes(letter);
    });
  },
  get greenLetters2() {
    return this.word2.split("").filter((letter, i) => {
      return this.guesses2
        .slice(0, this.currentGuess2)
        .map((word2) => word2[i])
        .includes(letter);
    });
  },
  get greenLetters3() {
    return this.word3.split("").filter((letter, i) => {
      return this.guesses3
        .slice(0, this.currentGuess3)
        .map((word3) => word3[i])
        .includes(letter);
    });
  },
  get greenLetters4() {
    return this.word4.split("").filter((letter, i) => {
      return this.guesses4
        .slice(0, this.currentGuess4)
        .map((word4) => word4[i])
        .includes(letter);
    });
  },

  // Array of correct letters in wrong or right position
  get yellowLetters1() {
    return this.word1
      .split("")
      .filter((letter) => this.allGuessedLetters.includes(letter));
  },
  get yellowLetters2() {
    return this.word2
      .split("")
      .filter((letter) => this.allGuessedLetters.includes(letter));
  },
  get yellowLetters3() {
    return this.word3
      .split("")
      .filter((letter) => this.allGuessedLetters.includes(letter));
  },
  get yellowLetters4() {
    return this.word4
      .split("")
      .filter((letter) => this.allGuessedLetters.includes(letter));
  },

  init() {
    this.word1 = words[Math.round(Math.random() * words.length)];
    this.word2 = words[Math.round(Math.random() * words.length)];
    this.word3 = words[Math.round(Math.random() * words.length)];
    this.word4 = words[Math.round(Math.random() * words.length)];
    this.guesses.replace(new Array(9).fill(""));
    this.guesses2.replace(new Array(9).fill(""));
    this.guesses3.replace(new Array(9).fill(""));
    this.guesses4.replace(new Array(9).fill(""));
    this.currentGuess = 0;
    this.currentGuess2 = 0;
    this.currentGuess3 = 0;
    this.currentGuess4 = 0;
  },

  submitGuess() {
    this.error = "";
    if (words.includes(this.guesses[this.currentGuess])) {
      this.currentGuess += 1;
    } else {
      this.error = "Not a valid word";
    }
    if (words.includes(this.guesses2[this.currentGuess2])) {
      this.currentGuess2 += 1;
    }
    if (words.includes(this.guesses3[this.currentGuess3])) {
      this.currentGuess3 += 1;
    }
    if (words.includes(this.guesses4[this.currentGuess4])) {
      this.currentGuess4 += 1;
    }
    if (this.roundComplete) {
      console.log("Round Complete");
      this.handleStats();
    }
  },

  addWordToGuessesArray(e, guesses, currentGuess, won) {
    if (
      guesses[currentGuess].length < 5 &&
      e.key.match(/^[A-z]$/) &&
      won === false
    ) {
      guesses[currentGuess] = guesses[currentGuess] + e.key.toLowerCase();
    }
  },

  deleteLetter(guesses, currentGuess) {
    guesses[currentGuess] = guesses[currentGuess].slice(
      0,
      guesses[currentGuess].length - 1
    );
  },

  handleKeyup(e) {
    if (this.roundComplete) {
      return;
    }

    if (e.key === "Enter") {
      return this.submitGuess();
    }
    if (e.key === "Backspace") {
      this.error = "";
      this.deleteLetter(this.guesses, this.currentGuess);
      this.deleteLetter(this.guesses2, this.currentGuess2);
      this.deleteLetter(this.guesses3, this.currentGuess3);
      this.deleteLetter(this.guesses4, this.currentGuess4);
      return;
    }
    this.addWordToGuessesArray(e, this.guesses, this.currentGuess, this.won1);
    this.addWordToGuessesArray(e, this.guesses2, this.currentGuess2, this.won2);
    this.addWordToGuessesArray(e, this.guesses3, this.currentGuess3, this.won3);
    this.addWordToGuessesArray(e, this.guesses4, this.currentGuess4, this.won4);
  },

  handleKeyClick(key) {
    if (key === "enter") {
      return this.submitGuess();
    }
    if (key === "delete") {      
      this.error = "";
      this.deleteLetter(this.guesses, this.currentGuess);
      this.deleteLetter(this.guesses2, this.currentGuess2);
      this.deleteLetter(this.guesses3, this.currentGuess3);
      this.deleteLetter(this.guesses4, this.currentGuess4);
      return;
    }
    if (this.guesses[this.currentGuess].length < 5) {
      this.guesses[this.currentGuess] =
        this.guesses[this.currentGuess] + key.toLowerCase();
    }
  },

  handleStats() {
    this.calculateScore();
    if (typeof window !== "undefined") {
      let stats = JSON.parse(localStorage.getItem("stats"));
      if (stats === null)
        stats = {
          wins: 0,
          losses: 0,
          gamesPlayed: 0,
          totalScore: 0,
          avgScore: 0,
          avgTurns: 0,
        };

      if (this.won) {
        stats.wins += 1;
      }
      if (this.lost) {
        stats.losses += 1;
      }
      stats.gamesPlayed += 1;
      stats.totalScore = stats.totalScore + this.totalScore;
      const turns = (stats.avgTurns + this.currentGuess) / stats.gamesPlayed;
      stats.avgTurns = Math.round((turns * 10) / 10);
      stats.avgScore = Math.round(stats.totalScore / stats.gamesPlayed);
      localStorage.setItem("stats", JSON.stringify(stats));
    }
  },
  calculateScore() {
    const unUsedLetters = (180 - this.allGuessedLetters.length);
    this.totalScore = unUsedLetters + this.correctLetters.length / 4;
    this.scorePercentage = (this.totalScore / 110) * 100;
    console.log("usused letters: ", unUsedLetters)
    console.log("all guessed letters: ", this.allGuessedLetters.length)
    console.log("this totalscore: ", this.totalScore)
    console.log("correct letters: ", this.correctLetters.length)
  },
};
