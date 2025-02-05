// Get the canvas and context
console.log("snake-dsa.js is loaded");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Device pixel ratio for high-resolution rendering
const dpr = window.devicePixelRatio || 1;
canvas.width = 1300 * dpr;
canvas.height = 960 * dpr;
canvas.style.width = "1300px";
canvas.style.height = "960px";
ctx.scale(dpr, dpr);

// Game dimensions
const windowWidth = 1300;
const windowHeight = 960;
const sidebarWidth = 200;
const gameWidth = windowWidth - sidebarWidth;

// Colors
const colors = {
  white: "#FFFFFF",
  green: "#00FF00",
  red: "#D53250",
  blue: "#6200ff",
  black: "#000000",
};

// Fonts
const fontStyle = "20px 'Varela Round'";
const scoreFont = "25px 'Poppins'";
const optionFont = "18px 'Varela Round'";

// Padding constants
const padding = {
  score: 20,
  question: 30,
  options: 20,
};

// Snake variables
const snakeBlock = 10;
const snakeSpeed = 100; // in ms

// DSA Questions and answers
const questions = [
  {
    question: "What is the time complexity of Binary Search?",
    options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
    answer: "O(log n)",
  },
  {
    question: "What is the space complexity of Merge Sort?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
    answer: "O(n)",
  },
  {
    question:
      "What data structure does Depth First Search (DFS) use to traverse the graph?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    answer: "Stack",
  },
  {
    question:
      "Which sorting algorithm is considered the fastest in the average case?",
    options: ["Bubble Sort", "Merge Sort", "Quick Sort", "Selection Sort"],
    answer: "Quick Sort",
  },
];

// Game variables
let snake = [{ x: gameWidth / 2, y: windowHeight / 2 }];
let direction = { x: 0, y: 0 };
let coins = [];
let score = 0;
let gameOver = false;
let currentQuestion = {};
let snakeTimer;
let gameEnded = false; // Flag to indicate if the game has ended

// Initialize the game
function initGame() {
  score = 0;
  gameOver = false;
  gameEnded = false; // Reset the game ended flag
  snake = [{ x: gameWidth / 2, y: windowHeight / 2 }];
  direction = { x: 0, y: 0 };
  generateQuestion();
  startGameLoop();
}

// Generate a random question
function generateQuestion() {
  currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  coins = currentQuestion.options.map((option, index) => ({
    x:
      Math.floor((Math.random() * (gameWidth - snakeBlock)) / 10) * 10 +
      sidebarWidth,
    y: Math.floor((Math.random() * windowHeight) / 10) * 10,
    isCorrect: option === currentQuestion.answer,
    number: index + 1,
  }));
}

// Draw the sidebar
function drawSidebar() {
  ctx.fillStyle = colors.black;
  ctx.fillRect(0, 0, sidebarWidth, windowHeight);

  ctx.fillStyle = colors.white;
  ctx.font = fontStyle;

  // Draw score
  ctx.font = scoreFont;
  ctx.fillText(`Score: ${score}`, 10, 30);

  // Add padding after score
  let currentY = 30 + padding.score;

  // Draw question
  ctx.font = fontStyle;
  const wrappedText = wrapText(currentQuestion.question, sidebarWidth - 20);
  wrappedText.forEach((line) => {
    ctx.fillText(line, 10, currentY);
    currentY += 25; // Line spacing
  });

  // Add padding after question
  currentY += padding.question;

  // Draw options
  currentQuestion.options.forEach((option, i) => {
    ctx.fillText(`${i + 1}. ${option}`, 10, currentY);
    currentY += 30 + padding.options; // Spacing between options
  });
}

// Wrap text for the sidebar
function wrapText(text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine + word + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth) {
      lines.push(currentLine);
      currentLine = word + " ";
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

// Draw the snake
function drawSnake() {
  ctx.fillStyle = colors.green;
  snake.forEach((segment) => {
    ctx.fillRect(segment.x, segment.y, snakeBlock, snakeBlock);
  });
}

// Draw coins (options)
function drawCoins() {
  coins.forEach((coin) => {
    ctx.fillStyle = colors.white;
    ctx.beginPath();
    ctx.arc(
      coin.x + snakeBlock / 2,
      coin.y + snakeBlock / 2,
      snakeBlock / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();

    ctx.fillStyle = colors.black;
    ctx.font = fontStyle;
    ctx.fillText(
      coin.number,
      coin.x + snakeBlock / 4,
      coin.y + snakeBlock / 1.5
    );
  });
}

// Draw the score
function drawScore() {
  ctx.fillStyle = colors.white;
  ctx.font = scoreFont;
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Game over screen
function drawGameOver() {
  ctx.fillStyle = colors.red;
  ctx.font = "30px 'Poppins'";
  ctx.fillText(
    "Game Over! Press R to Restart",
    gameWidth / 2 - 150,
    windowHeight / 2
  );
}

// Check collision
function checkCollision() {
  // Collision with walls
  const head = snake[0];
  if (
    head.x < sidebarWidth ||
    head.x >= windowWidth ||
    head.y < 0 ||
    head.y >= windowHeight
  ) {
    gameOver = true;
    gameEnded = true; // Set the game ended flag
    return;
  }

  // Collision with self
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver = true;
      gameEnded = true; // Set the game ended flag
      return;
    }
  }

  // Collision with coins
  coins.forEach((coin, index) => {
    if (head.x === coin.x && head.y === coin.y) {
      if (coin.isCorrect) {
        score++;
        snake.push({ ...snake[snake.length - 1] }); // Grow snake
      } else {
        gameOver = true;
        gameEnded = true; // Set the game ended flag
      }
      generateQuestion(); // Regenerate question and coins
    }
  });
}

// Update snake position
function updateSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);
  snake.pop();
}

// Game loop
function gameLoop() {
  if (gameOver) {
    clearInterval(snakeTimer);
    drawGameOver();
    if (gameEnded) {
      sendScoreReward(score); // Send reward only if the game has ended
    }
    return;
  }

  ctx.clearRect(0, 0, windowWidth, windowHeight);

  drawSidebar();
  drawSnake();
  drawCoins();
  drawScore();

  updateSnake();
  checkCollision();
}

// Start the game loop
function startGameLoop() {
  snakeTimer = setInterval(gameLoop, snakeSpeed);
}

// Handle keypress
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" && direction.y === 0)
    direction = { x: 0, y: -snakeBlock };
  if (event.key === "ArrowDown" && direction.y === 0)
    direction = { x: 0, y: snakeBlock };
  if (event.key === "ArrowLeft" && direction.x === 0)
    direction = { x: -snakeBlock, y: 0 };
  if (event.key === "ArrowRight" && direction.x === 0)
    direction = { x: snakeBlock, y: 0 };
  if (event.key === "r" && gameOver) initGame();
});

// Create a function to send ETH as a reward for the score
async function sendScoreReward(score) {
  try {
    console.log("Sending request to server..."); // Add this log
    const response = await fetch("http://localhost:3000/sendReward", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score }),
    });

    const result = await response.json();
    if (result.success) {
      alert(`Transaction successful! Sent reward for score: ${score}`);
    } else {
      alert(`Transaction failed: ${result.error}`);
    }
  } catch (error) {
    console.error("Transaction failed:", error);
    alert("Transaction failed. Check the console for details.");
  }
}

// Start the game
initGame();
