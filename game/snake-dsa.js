const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Game variables.
let score = 0;
let gameOver = false;
let rewardSent = false;
let lastTime = 0;
const blinkInterval = 500; // milliseconds

// Load images (update these paths to point to your assets).
const rocketImg = new Image();
const motorImg = new Image();
const backgroundImg = new Image();
rocketImg.src = "rocket.png"; // Rocket image path
motorImg.src = "motor.png"; // Obstacle image path
backgroundImg.src = "space_background.jpeg"; // Background image path

// Define the rocket (player) object.
let rocket = {
  x: WIDTH / 2 - 25,
  y: HEIGHT - 75,
  width: 50,
  height: 50,
  speed: 8, // This will be updated based on mood.
};

const numObstacles = 5;
let obstacles = [];

// These variables will be set based on mood detection.
let currentMood = "neutral"; // default
let obstacleSpeedFactor = 1.0;

// Initialize obstacles with speeds based on obstacleSpeedFactor.
function initObstacles() {
  obstacles = [];
  for (let i = 0; i < numObstacles; i++) {
    let obs = {
      x: Math.random() * (WIDTH - 50),
      y: Math.random() * -HEIGHT, // Start offscreen above the canvas
      width: 50,
      height: 50,
      speed: (6 + Math.random() * 4) * obstacleSpeedFactor, // Base speed adjusted by mood
    };
    obstacles.push(obs);
  }
}

// Keyboard input handling.
const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Simple rectangle collision detection.
function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

// Background scroll offset.
let bgOffsetY = 0;

// Blockchain integration: send reward for the final score.
async function sendScoreReward(finalScore) {
  try {
    console.log("Sending reward request for score:", finalScore);
    const response = await fetch("http://localhost:3001/sendReward", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score: finalScore }),
    });
    const result = await response.json();
    if (result.success) {
      alert(`Transaction successful! Reward sent for score: ${finalScore}`);
    } else {
      alert(`Transaction failed: ${result.error}`);
    }
  } catch (error) {
    console.error("Blockchain transaction failed:", error);
    alert("Transaction failed. See console for details.");
  }
}

// Main game loop using requestAnimationFrame.
function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  // Clear the canvas.
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Scroll the background faster.
  bgOffsetY += deltaTime * 0.1;
  if (bgOffsetY > HEIGHT) bgOffsetY = 0;
  ctx.drawImage(backgroundImg, 0, bgOffsetY - HEIGHT, WIDTH, HEIGHT);
  ctx.drawImage(backgroundImg, 0, bgOffsetY, WIDTH, HEIGHT);

  // Rocket movement based on left/right arrow keys.
  if (keys["ArrowLeft"] && rocket.x > 0) {
    rocket.x -= rocket.speed;
  }
  if (keys["ArrowRight"] && rocket.x < WIDTH - rocket.width) {
    rocket.x += rocket.speed;
  }

  // Update and draw obstacles.
  obstacles.forEach((obs) => {
    obs.y += obs.speed;
    if (obs.y > HEIGHT) {
      // Reset obstacle to the top with a new random x position.
      obs.y = -50 - Math.random() * HEIGHT;
      obs.x = Math.random() * (WIDTH - obs.width);
      score++;
    }
    ctx.drawImage(motorImg, obs.x, obs.y, obs.width, obs.height);

    // Blinking effect for obstacles.
    if (Math.floor(timestamp / blinkInterval) % 2 === 0) {
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      ctx.arc(
        obs.x + obs.width / 2,
        obs.y + obs.height / 2,
        30,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }
  });

  // Draw the rocket.
  ctx.drawImage(rocketImg, rocket.x, rocket.y, rocket.width, rocket.height);
  // Blinking effect for the rocket.
  if (Math.floor(timestamp / blinkInterval) % 2 === 0) {
    ctx.beginPath();
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 3;
    ctx.arc(
      rocket.x + rocket.width / 2,
      rocket.y + rocket.height / 2,
      30,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  // Collision detection.
  obstacles.forEach((obs) => {
    if (isColliding(rocket, obs)) {
      console.log("Collision Detected! Game Over. Your score:", score);
      gameOver = true;
    }
  });

  // Draw the score.
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  } else {
    // Display Game Over message and send blockchain reward.
    ctx.fillStyle = "red";
    ctx.font = "36px Arial";
    ctx.fillText("Game Over! Refresh to Restart", WIDTH / 2 - 200, HEIGHT / 2);
    if (!rewardSent) {
      rewardSent = true;
      sendScoreReward(score);
    }
  }
}

// ======= MOOD DETECTION INTEGRATION =======
const userVideo = document.getElementById("userVideo");
const captureCanvas = document.getElementById("captureCanvas");
const captureCtx = captureCanvas.getContext("2d");

async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    userVideo.srcObject = stream;
    return new Promise((resolve) => {
      userVideo.onloadedmetadata = () => {
        resolve();
      };
    });
  } catch (error) {
    console.error("Error accessing the camera:", error);
  }
}

function captureImage() {
  captureCanvas.width = userVideo.videoWidth || 640;
  captureCanvas.height = userVideo.videoHeight || 480;
  captureCtx.drawImage(userVideo, 0, 0);
  return captureCanvas.toDataURL("image/png");
}

async function detectMood(imageDataUrl) {
  try {
    const response = await fetch("http://127.0.0.1:5002/detect-mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageDataUrl }),
    });
    const result = await response.json();
    console.log("Detected Mood:", result.mood);
    return result.mood;
  } catch (error) {
    console.error("Error detecting mood:", error);
    return null;
  }
}

// This function starts the video, captures an image after a delay,
// detects the mood, adjusts game parameters, and then starts the game.
async function initializeGameWithMood() {
  await startVideo();
  // Wait 2 seconds to allow the video to stabilize.
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const imageData = captureImage();
  const detectedMood = await detectMood(imageData);
  // Stop the video stream.
  const stream = userVideo.srcObject;
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  if (detectedMood) {
    currentMood = detectedMood;
  }
  console.log("Using mood:", currentMood);

  // Adjust game parameters based on mood.
  switch (currentMood.toLowerCase()) {
    case "happy":
      rocket.speed = 9;
      obstacleSpeedFactor = 0.9;
      break;
    case "sad":
      rocket.speed = 7;
      obstacleSpeedFactor = 1.2;
      break;
    case "angry":
      rocket.speed = 10;
      obstacleSpeedFactor = 1.0;
      break;
    default:
      rocket.speed = 8;
      obstacleSpeedFactor = 1.0;
  }
  // Reinitialize obstacles to incorporate the updated speed factor.
  initObstacles();
  // Start the game loop.
  requestAnimationFrame(gameLoop);
}

// ======= START THE GAME =======
// Wait for all assets to load before initializing mood detection and starting the game.
let assetsLoaded = 0;
const totalAssets = 3;
[rocketImg, motorImg, backgroundImg].forEach((img) => {
  img.onload = () => {
    assetsLoaded++;
    if (assetsLoaded === totalAssets) {
      initializeGameWithMood();
    }
  };
});
