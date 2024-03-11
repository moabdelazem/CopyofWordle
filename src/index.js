import { wordsDict } from "./dict.js";

const State = {
  secret: wordsDict[Math.floor(Math.random() * wordsDict.length)],
  grid: Array(6)
    .fill()
    .map(() => Array(5).fill("")),
  currentRow: 0,
  currentCol: 0,
};

function updateGrid() {
  for (let i = 0; i < State.grid.length; i++) {
    for (let j = 0; j < State.grid[i].length; j++) {
      const box = document.getElementById(`box-${i}${j}`);
      box.textContent = State.grid[i][j];
    }
  }
}

function drawBox(container, row, col, letter = "") {
  const box = document.createElement("div");
  box.className = "box";
  box.id = `box-${row}${col}`;
  box.textContent = letter;

  container.appendChild(box);
  return box;
}

function drawGrid(container) {
  const grid = document.createElement("div");
  grid.className = "grid";

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      drawBox(grid, i, j);
    }
  }

  container.appendChild(grid);
}

function registerKeyboardEvents() {
  document.body.onkeydown = (event) => {
    const key = event.key;

    // Handling Submit Words
    if (key === "Enter") {
      if (State.currentCol === 5) {
        const word = getCurrentWord();
        if (isWordValid(word)) {
          revealWord(word);
          State.currentRow++;
          State.currentCol = 0;
        } else {
          alert("Not a Valid Word");
        }
      }
    }
    // Handling Deleting Words
    if (key === "Backspace") {
      removeLetter();
    }

    // Handling Add Words
    if (isLetter(key)) {
      addLetter(key);
    }

    updateGrid();
  };
}

function getCurrentWord() {
  return State.grid[State.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
  return wordsDict.includes(word);
}

function revealWord(guess) {
  const row = State.currentRow;
  const animationDuration = 500;

  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`box-${row}${i}`);
    const letter = box.textContent;

    setTimeout(() => {
      if (letter === State.secret[i]) {
        box.classList.add("right");
      } else if (State.secret.includes(letter)) {
        box.classList.add("wrong");
      } else {
        box.classList.add("empty");
      }
    }, ((i + 1) * animationDuration) / 2);

    box.classList.add("animated");
    box.style.animationDelay = `${(i * animationDuration) / 2}ms`;
  }

  const isWinner = State.secret === guess;
  const isGameOver = State.currentRow === 5;

  setTimeout(() => {
    if (isWinner) {
      return;
    } else if (isGameOver) {
      alert(`Better Luck Next Time! The Word Was ${State.secret}`);
    }
  }, 3 * animationDuration);
}

function isLetter(key) {
  return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
  if (State.currentCol === 5) return;
  State.grid[State.currentRow][State.currentCol] = letter;
  State.currentCol++;
}

function removeLetter() {
  if (State.currentCol === 0) return;
  State.grid[State.currentRow][State.currentCol - 1] = "";
  State.currentCol--;
}

function startUp() {
  const game = document.getElementById("game");
  drawGrid(game);

  registerKeyboardEvents();

  console.log(State.secret);
}

startUp();
