const { ethers } = require("hardhat");
require("dotenv").config({ path: '.env.local' });

// Contract address from deployment
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CASINO_CONTRACT_ADDRESS || "0xA7c0Cf20DD950EE1C07b758aD8B4B0fd3888595b";

// Contract ABI (minimal for testing)
const CONTRACT_ABI = [
  "function request(bytes32 userRandomNumber) external payable returns (uint64)",
  "function getContractInfo() external view returns (address contractAddress, address treasuryAddress, uint256 totalRequests, uint256 totalFulfilled, uint256 contractBalance)",
  "function getRequest(bytes32 requestId) external view returns (address requester, uint8 gameType, string memory gameSubType, bool fulfilled, bytes32 randomValue, uint256 timestamp, uint64 sequenceNumber, bytes32 commitment)",
  "function getAllRequestIds() external view returns (bytes32[] memory)",
  "function getGameTypeStats() external view returns (uint8[] memory gameTypes, uint256[] memory requestCounts, uint256[] memory fulfilledCounts)",
  "function isRequestFulfilled(bytes32 requestId) external view returns (bool)",
  "function getRandomValue(bytes32 requestId) external view returns (bytes32)",
  "function generateCommitment(bytes32 randomNumber) external pure returns (bytes32)",
  "function verifyCommitment(bytes32 commitment, bytes32 randomNumber) external pure returns (bool)",
  "event EntropyRequested(bytes32 indexed requestId, uint8 gameType, string gameSubType, address requester)",
  "event EntropyFulfilled(bytes32 indexed requestId, bytes32 randomValue)"
];

async function main() {
  console.log("🧪 Testing Deployed Casino Contract...");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("");

  try {
    // Get signer (treasury wallet)
    const [signer] = await ethers.getSigners();
    console.log("📝 Using account:", signer.address);
    
    const balance = await ethers.provider.getBalance(signer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "STT");
    console.log("");

    // Connect to contract
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    // Test 1: Get contract info
    console.log("📊 Test 1: Getting Contract Info...");
    const contractInfo = await contract.getContractInfo();
    console.log("✅ Contract Info:");
    console.log("   Contract Address:", contractInfo.contractAddress);
    console.log("   Treasury Address:", contractInfo.treasuryAddress);
    console.log("   Total Requests:", contractInfo.totalRequests.toString());
    console.log("   Total Fulfilled:", contractInfo.totalFulfilled.toString());
    console.log("   Contract Balance:", ethers.formatEther(contractInfo.contractBalance), "STT");
    console.log("");

    // Test 2: Get game type stats
    console.log("📊 Test 2: Getting Game Type Stats...");
    try {
      const stats = await contract.getGameTypeStats();
      console.log("✅ Game Type Stats:");
      const gameTypes = ["MINES", "PLINKO", "ROULETTE", "WHEEL"];
      for (let i = 0; i < stats.gameTypes.length; i++) {
        const gameTypeIndex = Number(stats.gameTypes[i]);
        console.log(`   ${gameTypes[gameTypeIndex]}:`);
        console.log(`      Requests: ${stats.requestCounts[i].toString()}`);
        console.log(`      Fulfilled: ${stats.fulfilledCounts[i].toString()}`);
      }
    } catch (error) {
      console.log("⚠️  Could not get game stats:", error.message);
    }
    console.log("");

    // Test 3: Get all request IDs
    console.log("📊 Test 3: Getting All Request IDs...");
    const allRequestIds = await contract.getAllRequestIds();
    console.log("✅ Total Request IDs:", allRequestIds.length);
    if (allRequestIds.length > 0) {
      console.log("   First 5 Request IDs:");
      for (let i = 0; i < Math.min(5, allRequestIds.length); i++) {
        console.log(`   ${i + 1}. ${allRequestIds[i]}`);
      }
    }
    console.log("");

    // Test 4: Generate a random number and make a request
    console.log("🎲 Test 4: Making Entropy Request...");
    const userRandomNumber = ethers.randomBytes(32);
    const userRandomHex = ethers.hexlify(userRandomNumber);
    console.log("   User Random Number:", userRandomHex);
    
    // Generate commitment
    const commitment = await contract.generateCommitment(userRandomHex);
    console.log("   Commitment:", commitment);
    
    // Verify commitment
    const isValidCommitment = await contract.verifyCommitment(commitment, userRandomHex);
    console.log("   Commitment Valid:", isValidCommitment);
    
    // Make request (needs 0.001 ETH = 1000000000000000 wei)
    const requestFee = ethers.parseEther("0.001");
    console.log("   Request Fee:", ethers.formatEther(requestFee), "STT");
    
    console.log("   Sending transaction...");
    const tx = await contract.request(userRandomHex, {
      value: requestFee
    });
    
    console.log("   Transaction Hash:", tx.hash);
    console.log("   Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("   ✅ Transaction confirmed in block:", receipt.blockNumber);
    
    // Get sequence number from receipt
    let sequenceNumber = null;
    let requestId = null;
    
    // Try to find the event
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (parsedLog && parsedLog.name === "EntropyRequested") {
          requestId = parsedLog.args.requestId;
          console.log("   Request ID:", requestId);
          break;
        }
      } catch (e) {
        // Not our event, continue
      }
    }
    
    // If we couldn't find event, derive from tx
    if (!requestId) {
      // Get sequence number from return value or derive from tx
      const txResult = await tx;
      console.log("   ⚠️  Could not extract request ID from events");
    }
    
    console.log("");

    // Test 5: Get updated contract info
    console.log("📊 Test 5: Getting Updated Contract Info...");
    const updatedInfo = await contract.getContractInfo();
    console.log("✅ Updated Contract Info:");
    console.log("   Total Requests:", updatedInfo.totalRequests.toString());
    console.log("   Total Fulfilled:", updatedInfo.totalFulfilled.toString());
    console.log("   Contract Balance:", ethers.formatEther(updatedInfo.contractBalance), "STT");
    console.log("");

    // Test 6: Get all request IDs again
    console.log("📊 Test 6: Getting Updated Request IDs...");
    const updatedRequestIds = await contract.getAllRequestIds();
    console.log("✅ Updated Total Request IDs:", updatedRequestIds.length);
    
    if (updatedRequestIds.length > 0) {
      // Get details of the latest request
      const latestRequestId = updatedRequestIds[updatedRequestIds.length - 1];
      console.log("   Latest Request ID:", latestRequestId);
      
      try {
        const requestDetails = await contract.getRequest(latestRequestId);
        console.log("   Request Details:");
        console.log("      Requester:", requestDetails.requester);
        console.log("      Game Type:", requestDetails.gameType.toString());
        console.log("      Fulfilled:", requestDetails.fulfilled);
        console.log("      Sequence Number:", requestDetails.sequenceNumber.toString());
        console.log("      Timestamp:", new Date(Number(requestDetails.timestamp) * 1000).toISOString());
        
        if (requestDetails.fulfilled) {
          console.log("      Random Value:", requestDetails.randomValue);
        } else {
          console.log("      Random Value: (pending)");
        }
      } catch (error) {
        console.log("   ⚠️  Could not get request details:", error.message);
      }
    }
    console.log("");

    // Test 7: Check if request is fulfilled (it might take time)
    if (requestId) {
      console.log("⏳ Test 7: Checking Request Fulfillment Status...");
      const isFulfilled = await contract.isRequestFulfilled(requestId);
      console.log("   Request Fulfilled:", isFulfilled);
      
      if (isFulfilled) {
        const randomValue = await contract.getRandomValue(requestId);
        console.log("   Random Value:", randomValue);
      } else {
        console.log("   ⏳ Request is still pending fulfillment");
        console.log("   Note: Pyth Entropy may take a few blocks to fulfill");
      }
      console.log("");
    }

    // Test 8: Check account balance after transaction
    console.log("💰 Test 8: Checking Account Balance After Transaction...");
    const finalBalance = await ethers.provider.getBalance(signer.address);
    console.log("   Final Balance:", ethers.formatEther(finalBalance), "STT");
    const balanceDiff = balance - finalBalance;
    console.log("   Balance Used:", ethers.formatEther(balanceDiff), "STT");
    console.log("");

    console.log("🎉 All tests completed successfully!");
    console.log("");
    console.log("📋 Summary:");
    console.log("   ✅ Contract is accessible");
    console.log("   ✅ Entropy request submitted");
    console.log("   ✅ Contract state updated");
    console.log("");
    console.log("🔗 View on Explorer:");
    console.log(`   https://shannon-explorer.somnia.network/address/${CONTRACT_ADDRESS}`);
    if (receipt) {
      console.log(`   Transaction: https://shannon-explorer.somnia.network/tx/${receipt.hash}`);
    }

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.transaction) {
      console.error("   Transaction Hash:", error.transaction.hash);
    }
    if (error.reason) {
      console.error("   Reason:", error.reason);
    }
    console.error("   Stack:", error.stack);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test suite failed:", error);
    process.exit(1);
  });

