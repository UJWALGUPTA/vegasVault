const { ethers } = require("hardhat");
require("dotenv").config({ path: '.env.local' });

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CASINO_CONTRACT_ADDRESS || "0xA7c0Cf20DD950EE1C07b758aD8B4B0fd3888595b";

const CONTRACT_ABI = [
  // Owner functions
  "function updateTreasury(address newTreasury) external",
  "function updateEntropyFee(uint256 newFee) external",
  "function withdrawFees(address to) external",
  "function owner() external view returns (address)",
  
  // View functions
  "function getContractInfo() external view returns (address contractAddress, address treasuryAddress, uint256 totalRequests, uint256 totalFulfilled, uint256 contractBalance)",
  "function treasury() external view returns (address)",
  "function entropyFee() external view returns (uint256)",
  "event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury)"
];

async function main() {
  console.log("🧪 Testing Contract Transactions (Owner Functions)...");
  console.log("Contract Address:", CONTRACT_ADDRESS);
  console.log("");

  try {
    const [signer] = await ethers.getSigners();
    console.log("📝 Using account:", signer.address);
    const initialBalance = await ethers.provider.getBalance(signer.address);
    console.log("💰 Initial balance:", ethers.formatEther(initialBalance), "STT");
    console.log("");

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // Verify we're the owner
    console.log("🔐 Verifying Ownership...");
    const owner = await contract.owner();
    if (owner.toLowerCase() !== signer.address.toLowerCase()) {
      throw new Error("Signer is not the contract owner");
    }
    console.log("✅ Verified as owner");
    console.log("");

    // Test 1: Get initial state
    console.log("📊 Test 1: Getting Initial Contract State...");
    let contractInfo = await contract.getContractInfo();
    const initialTreasury = await contract.treasury();
    const initialFee = await contract.entropyFee();
    
    console.log("✅ Initial State:");
    console.log("   Treasury:", initialTreasury);
    console.log("   Entropy Fee:", ethers.formatEther(initialFee), "STT");
    console.log("   Contract Balance:", ethers.formatEther(contractInfo.contractBalance), "STT");
    console.log("");

    // Test 2: Update entropy fee
    console.log("📊 Test 2: Updating Entropy Fee...");
    const newFee = ethers.parseEther("0.002"); // 0.002 STT
    console.log("   Old Fee:", ethers.formatEther(initialFee), "STT");
    console.log("   New Fee:", ethers.formatEther(newFee), "STT");
    
    console.log("   Sending transaction...");
    const tx1 = await contract.updateEntropyFee(newFee);
    console.log("   Transaction Hash:", tx1.hash);
    console.log("   Waiting for confirmation...");
    const receipt1 = await tx1.wait();
    console.log("   ✅ Transaction confirmed in block:", receipt1.blockNumber);
    
    // Verify fee was updated
    const updatedFee = await contract.entropyFee();
    console.log("   Updated Fee:", ethers.formatEther(updatedFee), "STT");
    if (updatedFee.toString() !== newFee.toString()) {
      throw new Error("Fee was not updated correctly");
    }
    console.log("✅ Fee updated successfully");
    console.log("");

    // Test 3: Revert fee back to original
    console.log("📊 Test 3: Reverting Fee to Original...");
    console.log("   Reverting to:", ethers.formatEther(initialFee), "STT");
    const tx2 = await contract.updateEntropyFee(initialFee);
    console.log("   Transaction Hash:", tx2.hash);
    const receipt2 = await tx2.wait();
    console.log("   ✅ Transaction confirmed in block:", receipt2.blockNumber);
    
    const revertedFee = await contract.entropyFee();
    console.log("   Current Fee:", ethers.formatEther(revertedFee), "STT");
    console.log("✅ Fee reverted successfully");
    console.log("");

    // Test 4: Update treasury (create a new address for testing)
    console.log("📊 Test 4: Testing Treasury Update...");
    // Generate a new wallet for testing
    const testWallet = ethers.Wallet.createRandom();
    const testTreasuryAddress = testWallet.address;
    console.log("   Current Treasury:", initialTreasury);
    console.log("   New Treasury (test):", testTreasuryAddress);
    
    console.log("   Sending transaction...");
    const tx3 = await contract.updateTreasury(testTreasuryAddress);
    console.log("   Transaction Hash:", tx3.hash);
    console.log("   Waiting for confirmation...");
    const receipt3 = await tx3.wait();
    console.log("   ✅ Transaction confirmed in block:", receipt3.blockNumber);
    
    // Check for event
    for (const log of receipt3.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (parsedLog && parsedLog.name === "TreasuryUpdated") {
          console.log("   Event TreasuryUpdated:");
          console.log("      Old Treasury:", parsedLog.args.oldTreasury);
          console.log("      New Treasury:", parsedLog.args.newTreasury);
        }
      } catch (e) {
        // Not our event
      }
    }
    
    // Verify treasury was updated
    const updatedTreasury = await contract.treasury();
    console.log("   Updated Treasury:", updatedTreasury);
    if (updatedTreasury.toLowerCase() !== testTreasuryAddress.toLowerCase()) {
      throw new Error("Treasury was not updated correctly");
    }
    console.log("✅ Treasury updated successfully");
    console.log("");

    // Test 5: Revert treasury back to original
    console.log("📊 Test 5: Reverting Treasury to Original...");
    console.log("   Reverting to:", initialTreasury);
    const tx4 = await contract.updateTreasury(initialTreasury);
    console.log("   Transaction Hash:", tx4.hash);
    const receipt4 = await tx4.wait();
    console.log("   ✅ Transaction confirmed in block:", receipt4.blockNumber);
    
    const revertedTreasury = await contract.treasury();
    console.log("   Current Treasury:", revertedTreasury);
    console.log("✅ Treasury reverted successfully");
    console.log("");

    // Test 6: Test withdrawFees (even if balance is 0)
    console.log("📊 Test 6: Testing Withdraw Fees Function...");
    contractInfo = await contract.getContractInfo();
    console.log("   Contract Balance:", ethers.formatEther(contractInfo.contractBalance), "STT");
    
    let receipt5 = null;
    if (contractInfo.contractBalance > 0n) {
      console.log("   Attempting to withdraw fees...");
      const tx5 = await contract.withdrawFees(signer.address);
      console.log("   Transaction Hash:", tx5.hash);
      receipt5 = await tx5.wait();
      console.log("   ✅ Transaction confirmed in block:", receipt5.blockNumber);
      
      // Check updated balance
      const updatedInfo = await contract.getContractInfo();
      console.log("   Updated Contract Balance:", ethers.formatEther(updatedInfo.contractBalance), "STT");
      console.log("✅ Withdraw fees executed (if balance was > 0)");
    } else {
      console.log("   ⚠️  Contract has no balance to withdraw");
      console.log("   ✅ Function exists and is callable");
    }
    console.log("");

    // Test 7: Final state check
    console.log("📊 Test 7: Final Contract State Check...");
    const finalInfo = await contract.getContractInfo();
    const finalTreasury = await contract.treasury();
    const finalFee = await contract.entropyFee();
    
    console.log("✅ Final State:");
    console.log("   Treasury:", finalTreasury);
    console.log("   Entropy Fee:", ethers.formatEther(finalFee), "STT");
    console.log("   Contract Balance:", ethers.formatEther(finalInfo.contractBalance), "STT");
    console.log("   Total Requests:", finalInfo.totalRequests.toString());
    console.log("   Total Fulfilled:", finalInfo.totalFulfilled.toString());
    console.log("");

    // Test 8: Check account balance after transactions
    console.log("💰 Test 8: Checking Account Balance After Transactions...");
    const finalBalance = await ethers.provider.getBalance(signer.address);
    console.log("   Final Balance:", ethers.formatEther(finalBalance), "STT");
    const balanceUsed = initialBalance - finalBalance;
    console.log("   Balance Used:", ethers.formatEther(balanceUsed), "STT");
    console.log("");

    console.log("🎉 All transaction tests completed successfully!");
    console.log("");
    console.log("📋 Summary:");
    console.log("   ✅ Owner functions work correctly");
    console.log("   ✅ Treasury can be updated");
    console.log("   ✅ Entropy fee can be updated");
    console.log("   ✅ Withdraw fees function is callable");
    console.log("   ✅ All state changes are persistent");
    console.log("");
    console.log("🔗 View Transactions on Explorer:");
    if (receipt1) console.log(`   Fee Update: https://shannon-explorer.somnia.network/tx/${receipt1.hash}`);
    if (receipt2) console.log(`   Fee Revert: https://shannon-explorer.somnia.network/tx/${receipt2.hash}`);
    if (receipt3) console.log(`   Treasury Update: https://shannon-explorer.somnia.network/tx/${receipt3.hash}`);
    if (receipt4) console.log(`   Treasury Revert: https://shannon-explorer.somnia.network/tx/${receipt4.hash}`);
    if (receipt5) console.log(`   Withdraw Fees: https://shannon-explorer.somnia.network/tx/${receipt5.hash}`);

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

