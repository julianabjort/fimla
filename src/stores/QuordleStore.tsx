import { warnEnvConflicts } from "@prisma/client/runtime";
import { loadStaticPaths } from "next/dist/server/dev/static-paths-worker";
import { threadId } from "worker_threads";
import words from "../data/words.json";

export default {
  word1: '',
  word2: '',
  word3: '',
  word4: '',
  guesses: [],
  currentGuess: 0,
  win1: false,
  win2: false,
  win3: false,
  win4: false,
  win: false,

  get won() {
    const won1 = this.guesses[this.currentGuess - 1] === this.word1
    if(won1){this.win1 = true}
    const won2 = this.guesses[this.currentGuess - 1] === this.word2
    if(won2){this.win2 = true}
    const won3 = this.guesses[this.currentGuess - 1] === this.word3
    if(won3){this.win3 = true}
    const won4 = this.guesses[this.currentGuess - 1] === this.word4
    if(won4){this.win4 = true}
    // if all four words are correct you win
    if (!this.win1 === true && this.win2 === true && this.win3 === true && this.win4 === true){
      this.win = false
    }
    if(this.win1 === true && this.win2 === true && this.win3 === true && this.win4 === true) {
      this.win = true
    }
    return won1 && won2 && won3 && won4
  },


  get lost() {
    // return this.currentGuess === 6
    return this.win === false && this.currentGuess === 6
  },

  get roundComplete() {
    const won1 = this.guesses[this.currentGuess - 1] === this.word1
    if(won1){this.win1 = true}
    const won2 = this.guesses[this.currentGuess - 1] === this.word2
    if(won2){this.win2 = true}
    const won3 = this.guesses[this.currentGuess - 1] === this.word3
    if(won3){this.win3 = true}
    const won4 = this.guesses[this.currentGuess - 1] === this.word4
    if(won4){this.win4 = true}
    console.log("HERE")
    return (
      won1 && won2 && won3 && won4 ||
      this.currentGuess === 6
    );
  },

  get allGuessedLetters() {
    return this.guesses.slice(0, this.currentGuess).join("").split("");
  },

  get correctLetters() {
    const word1 = 
    this.allGuessedLetters.filter(
      (letter1) => 
    this.word1.split("").some(
      (letter2) => letter1 === letter2)

      )


    const word2 = this.allGuessedLetters.filter((letter1) => 
    this.word2.split("").some((letter2) => letter1 === letter2))
    const word3 = this.allGuessedLetters.filter((letter1) => 
    this.word3.split("").some((letter2) => letter1 === letter2))
    const word4 = this.allGuessedLetters.filter((letter1) => 
    this.word4.split("").some((letter2) => letter1 === letter2))
    return ([(word1) +","+ (word2) +","+ (word3) +","+ (word4)])
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
      return this.guesses
        .slice(0, this.currentGuess)
        .map((word2) => word2[i])
        .includes(letter);
    });
  },
  get greenLetters3() {
    return this.word3.split("").filter((letter, i) => {
      return this.guesses
        .slice(0, this.currentGuess)
        .map((word3) => word3[i])
        .includes(letter);
    });
  },
  get greenLetters4() {
    return this.word4.split("").filter((letter, i) => {
      return this.guesses
        .slice(0, this.currentGuess)
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
    this.word1 = words[Math.round(Math.random() * words.length)]
    this.word2 = words[Math.round(Math.random() * words.length)]
    this.word3 = words[Math.round(Math.random() * words.length)]
    this.word4 = words[Math.round(Math.random() * words.length)]
    this.guesses.replace(new Array(6).fill(''))
    this.currentGuess = 0
  },

  submitGuess() {
    if (words.includes(this.guesses[this.currentGuess])) {
      this.currentGuess += 1
    } 
    if (this.roundComplete) {
      this.handleStats();
    }
  },

  handleKeyup(e) {
    if(this.roundComplete) {
      console.log("Finito?")
      return;
    }

    if (e.key === 'Enter') {
      return this.submitGuess()
    }
    if (e.key === 'Backspace') {
      this.guesses[this.currentGuess] = this.guesses[this.currentGuess].slice(
        0,
        this.guesses[this.currentGuess].length -1
      )
      return
    }
    if (
      this.guesses[this.currentGuess].length < 5 &&
      e.key.match(/^[A-z]$/)
    ) {
      this.guesses[this.currentGuess] =
        this.guesses[this.currentGuess] + e.key.toLowerCase()
    }
  },
  
  handleKeyClick(key) {
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

      if(this.win === true){
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
    const unUsedLetters = (30 - this.allGuessedLetters.length) * 4;
    this.totalScore = unUsedLetters + this.correctLetters.length * 2;
    this.scorePercentage = (this.totalScore / 110) * 100;
    console.log(this.scorePercentage);
    console.log(Math.round(this.scorePercentage));
    console.log(unUsedLetters)
    console.log(this.allGuessedLetters)
    console.log(this.correctLetters)
  }
}