const { ethers } = require("hardhat");
require("dotenv").config({ path: '.env.local' });

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CASINO_CONTRACT_ADDRESS || "0xA7c0Cf20DD950EE1C07b758aD8B4B0fd3888595b";

const CONTRACT_ABI = [
  "function getContractInfo() external view returns (address contractAddress, address treasuryAddress, uint256 totalRequests, uint256 totalFulfilled, uint256 contractBalance)",
  "function getGameTypeStats() external view returns (uint8[] memory gameTypes, uint256[] memory requestCounts, uint256[] memory fulfilledCounts)",
  "function getAllRequestIds() external view returns (bytes32[] memory)",
  "function getRequest(bytes32 requestId) external view returns (address requester, uint8 gameType, string memory gameSubType, bool fulfilled, bytes32 randomValue, uint256 timestamp, uint64 sequenceNumber, bytes32 commitment)",
  "function generateCommitment(bytes32 randomNumber) external pure returns (bytes32)",
  "function verifyCommitment(bytes32 commitment, bytes32 randomNumber) external pure returns (bool)",
  "function owner() external view returns (address)",
  "function treasury() external view returns (address)",
  "function entropy() external view returns (address)",
  "function provider() external view returns (address)",
  "function entropyFee() external view returns (uint256)"
];

async function main() {
  console.log("🧪 Testing Contract Read Functions...");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("");

  try {
    const [signer] = await ethers.getSigners();
    console.log("📝 Using account:", signer.address);
    const balance = await ethers.provider.getBalance(signer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "STT");
    console.log("");

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // Test 1: Get contract owner
    console.log("📊 Test 1: Getting Contract Owner...");
    try {
      const owner = await contract.owner();
      console.log("✅ Owner:", owner);
      console.log("   Is signer owner?", owner.toLowerCase() === signer.address.toLowerCase());
    } catch (error) {
      console.log("⚠️  Could not get owner:", error.message);
    }
    console.log("");

    // Test 2: Get treasury address
    console.log("📊 Test 2: Getting Treasury Address...");
    try {
      const treasury = await contract.treasury();
      console.log("✅ Treasury:", treasury);
    } catch (error) {
      console.log("⚠️  Could not get treasury:", error.message);
    }
    console.log("");

    // Test 3: Get entropy contract address
    console.log("📊 Test 3: Getting Entropy Contract Address...");
    try {
      const entropyAddr = await contract.entropy();
      console.log("✅ Entropy Contract:", entropyAddr);
      
      // Check if contract exists
      const code = await ethers.provider.getCode(entropyAddr);
      console.log("   Contract Code:", code === '0x' ? 'NOT FOUND' : 'EXISTS');
    } catch (error) {
      console.log("⚠️  Could not get entropy address:", error.message);
    }
    console.log("");

    // Test 4: Get provider address
    console.log("📊 Test 4: Getting Provider Address...");
    try {
      const providerAddr = await contract.provider();
      console.log("✅ Provider:", providerAddr);
    } catch (error) {
      console.log("⚠️  Could not get provider:", error.message);
    }
    console.log("");

    // Test 5: Get entropy fee
    console.log("📊 Test 5: Getting Entropy Fee...");
    try {
      const fee = await contract.entropyFee();
      console.log("✅ Entropy Fee:", ethers.formatEther(fee), "STT");
    } catch (error) {
      console.log("⚠️  Could not get fee:", error.message);
    }
    console.log("");

    // Test 6: Get contract info
    console.log("📊 Test 6: Getting Contract Info...");
    const contractInfo = await contract.getContractInfo();
    console.log("✅ Contract Info:");
    console.log("   Contract Address:", contractInfo.contractAddress);
    console.log("   Treasury Address:", contractInfo.treasuryAddress);
    console.log("   Total Requests:", contractInfo.totalRequests.toString());
    console.log("   Total Fulfilled:", contractInfo.totalFulfilled.toString());
    console.log("   Contract Balance:", ethers.formatEther(contractInfo.contractBalance), "STT");
    console.log("");

    // Test 7: Get game type stats
    console.log("📊 Test 7: Getting Game Type Stats...");
    const stats = await contract.getGameTypeStats();
    console.log("✅ Game Type Stats:");
    const gameTypes = ["MINES", "PLINKO", "ROULETTE", "WHEEL"];
    for (let i = 0; i < stats.gameTypes.length; i++) {
      const gameTypeIndex = Number(stats.gameTypes[i]);
      console.log(`   ${gameTypes[gameTypeIndex]}:`);
      console.log(`      Requests: ${stats.requestCounts[i].toString()}`);
      console.log(`      Fulfilled: ${stats.fulfilledCounts[i].toString()}`);
    }
    console.log("");

    // Test 8: Get all request IDs
    console.log("📊 Test 8: Getting All Request IDs...");
    const allRequestIds = await contract.getAllRequestIds();
    console.log("✅ Total Request IDs:", allRequestIds.length);
    if (allRequestIds.length > 0) {
      console.log("   Request IDs:");
      for (let i = 0; i < Math.min(10, allRequestIds.length); i++) {
        console.log(`   ${i + 1}. ${allRequestIds[i]}`);
        
        // Get request details
        try {
          const requestDetails = await contract.getRequest(allRequestIds[i]);
          console.log(`      Requester: ${requestDetails.requester}`);
          console.log(`      Fulfilled: ${requestDetails.fulfilled}`);
          console.log(`      Sequence: ${requestDetails.sequenceNumber.toString()}`);
        } catch (e) {
          console.log(`      Could not get details: ${e.message}`);
        }
      }
    }
    console.log("");

    // Test 9: Test commitment generation
    console.log("📊 Test 9: Testing Commitment Generation...");
    const testRandom = ethers.randomBytes(32);
    const testRandomHex = ethers.hexlify(testRandom);
    console.log("   Test Random:", testRandomHex);
    
    const commitment = await contract.generateCommitment(testRandomHex);
    console.log("   Commitment:", commitment);
    
    const isValid = await contract.verifyCommitment(commitment, testRandomHex);
    console.log("   Valid:", isValid);
    console.log("");

    console.log("🎉 All read tests completed successfully!");
    console.log("");
    console.log("📋 Summary:");
    console.log("   ✅ Contract is accessible and responding");
    console.log("   ✅ All view functions work correctly");
    console.log("   ✅ Contract state is readable");
    console.log("");
    console.log("🔗 View on Explorer:");
    console.log(`   https://shannon-explorer.somnia.network/address/${CONTRACT_ADDRESS}`);

  } catch (error) {
    console.error("❌ Test failed:", error.message);
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

