const express = require("express");
const cors = require("cors"); // Import the cors package
const { sendScoreReward } = require("./transaction");

const app = express();
const port = 3001;

app.use(cors()); // Use the cors middleware
app.use(express.json());

app.post("/sendReward", async (req, res) => {
  console.log("Received request to send reward"); // Add this log
  const { score } = req.body;
  const result = await sendScoreReward(score);
  res.json(result);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
