const { ethers } = require("ethers");

// Configure the provider to connect to your local Hardhat blockchain
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

// Use the first Hardhat account as the sender
const signer = provider.getSigner(0);

// The recipient's wallet address (replace with your actual test wallet)
const recipientAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

async function sendScoreReward(score) {
  try {
    // Convert score to ETH (e.g., 0.001% of the score)
    const ethAmount = ethers.utils.parseUnits(
      (score * 0.00001).toFixed(18),
      18
    );

    // Create and send the transaction
    const tx = await signer.sendTransaction({
      to: recipientAddress,
      value: ethAmount,
    });

    console.log("Transaction sent! Hash:", tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction mined! Receipt:", receipt);
    return { success: true, txHash: tx.hash };
  } catch (error) {
    console.error("Transaction failed:", error);
    return { success: false, error: error.message };
  }
}

module.exports = { sendScoreReward };
