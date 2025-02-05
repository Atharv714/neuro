    const canvas = document.getElementById("gameCanvas");
    // canvas.width = 1300; 
    // canvas.height = 960; 

    const ctx = canvas.getContext("2d");

    const questions = [
      {
        question: "Find the missing number in the array.",
        testCase: "[1, 2, 3, 4, 6] -> Missing number is 5",
        solution: (arr) => {
          const n = arr.length + 1;
          const expectedSum = (n * (n + 1)) / 2;
          const actualSum = arr.reduce((a, b) => a + b, 0);
          return expectedSum - actualSum;
        },
        input: [1, 2, 3, 4, 6],
        expectedOutput: 5,
      },
      {
        question: "Find the longest increasing subsequence in an array.",
        testCase: "[10, 22, 9, 33, 21, 50, 41, 60, 80] -> Longest increasing subsequence is 6",
        solution: (arr) => {
          const dp = Array(arr.length).fill(1);
          for (let i = 1; i < arr.length; i++) {
            for (let j = 0; j < i; j++) {
              if (arr[i] > arr[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
              }
            }
          }
          return Math.max(...dp);
        },
        input: [10, 22, 9, 33, 21, 50, 41, 60, 80],
        expectedOutput: 6,
      },
    ];

    let currentQuestion = null;

    const drawQuestion = (questionText, testCase) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "20px poppins";
      ctx.fillText("Question:", 10, 30);
      ctx.fillText(questionText, 10, 60);
      ctx.fillText("Test Case:", 10, 100);
      ctx.fillText(testCase, 10, 130);
    };

    const startGame = () => {
      currentQuestion = questions[Math.floor(Math.random() * questions.length)];
      drawQuestion(currentQuestion.question, currentQuestion.testCase);
    };

    const runCode = () => {
  const userCode = document.getElementById("codeEditor").value;
  const outputArea = document.getElementById("output");
  outputArea.textContent = "";

  try {
    // Create a function from the user's code, expecting "input" as its argument
    const userFunction = new Function("input", `
      ${userCode}
      return findMissingNumber(input);
    `);

    // Run the user's function with the test input
    const userOutput = userFunction(currentQuestion.input);
    const correctOutput = currentQuestion.expectedOutput;

    // Compare the user's output with the expected output
    if (userOutput === correctOutput) {
      outputArea.textContent = "Correct! 🎉";
    } else {
      outputArea.textContent = `Incorrect! ❌ Expected: ${correctOutput}, but got: ${userOutput}`;
    }
  } catch (error) {
    outputArea.textContent = `Error: ${error.message}`;
  }
};

    document.getElementById("runCode").addEventListener("click", runCode);

    startGame();
