const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Deploying CasinoEntropyConsumerV2 to Somnia Network...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "STT");

  // Get network info
  const network = await ethers.provider.getNetwork();
  const networkName = network.name || 'somnia-testnet';
  const chainId = network.chainId.toString();
  
  console.log("Network:", networkName);
  console.log("Chain ID:", chainId);

  // Validate we're on Somnia network
  const somniaChainIds = ['5031', '50312']; // Mainnet and Testnet
  if (!somniaChainIds.includes(chainId)) {
    console.log("⚠️  Warning: Chain ID", chainId, "does not match expected Somnia chain IDs (5031 or 50312)");
    console.log("   Continuing anyway...");
  }

  // Pyth Entropy contract addresses for Somnia
  // Note: These addresses may need to be verified/updated for Somnia network
  const PYTH_ENTROPY_ADDRESSES = {
    'somnia-testnet': process.env.NEXT_PUBLIC_SOMNIA_PYTH_ENTROPY_CONTRACT || '0x36825bf3fbdf5a29e2d5148bfe7dcf7b5639e320',
    'somnia-mainnet': process.env.NEXT_PUBLIC_SOMNIA_MAINNET_PYTH_ENTROPY_CONTRACT || '0x36825bf3fbdf5a29e2d5148bfe7dcf7b5639e320',
    '50312': process.env.NEXT_PUBLIC_SOMNIA_PYTH_ENTROPY_CONTRACT || '0x36825bf3fbdf5a29e2d5148bfe7dcf7b5639e320',
    '5031': process.env.NEXT_PUBLIC_SOMNIA_MAINNET_PYTH_ENTROPY_CONTRACT || '0x36825bf3fbdf5a29e2d5148bfe7dcf7b5639e320',
  };

  // Determine network name for Pyth contract lookup
  const networkKey = chainId === '5031' ? 'somnia-mainnet' : 'somnia-testnet';
  let pythEntropyAddress = PYTH_ENTROPY_ADDRESSES[networkName] || PYTH_ENTROPY_ADDRESSES[chainId] || PYTH_ENTROPY_ADDRESSES[networkKey];
  
  if (!pythEntropyAddress) {
    console.log("❌ Pyth Entropy address not configured for this network");
    console.log("   Please set NEXT_PUBLIC_SOMNIA_PYTH_ENTROPY_CONTRACT environment variable");
    return;
  }

  console.log("Pyth Entropy address:", pythEntropyAddress);

  // Verify Pyth Entropy contract exists
  const code = await ethers.provider.getCode(pythEntropyAddress);
  if (code === '0x') {
    console.log("⚠️  Warning: No contract found at Pyth Entropy address:", pythEntropyAddress);
    console.log("   Continuing deployment anyway...");
  } else {
    console.log("✅ Pyth Entropy contract verified at:", pythEntropyAddress);
  }

  // Treasury address from config
  const treasuryAddress = process.env.SOMNIA_TREASURY_ADDRESS || 
                         process.env.MONAD_TREASURY_ADDRESS || 
                         process.env.TREASURY_ADDRESS || 
                         deployer.address;
  console.log("Treasury address:", treasuryAddress);

  // Pyth Entropy provider address (same as contract for now, or from env)
  const pythProviderAddress = process.env.NEXT_PUBLIC_SOMNIA_PYTH_ENTROPY_PROVIDER || 
                             process.env.NEXT_PUBLIC_MONAD_PYTH_ENTROPY_PROVIDER || 
                             pythEntropyAddress;
  console.log("Pyth Provider address:", pythProviderAddress);

  // Deploy the contract
  console.log("\n📦 Deploying CasinoEntropyConsumerV2...");
  const CasinoEntropyConsumerV2 = await ethers.getContractFactory("CasinoEntropyConsumerV2");
  
  const casinoContract = await CasinoEntropyConsumerV2.deploy(
    pythEntropyAddress,
    pythProviderAddress,
    treasuryAddress
  );

  console.log("⏳ Waiting for deployment transaction...");
  await casinoContract.waitForDeployment();

  const contractAddress = await casinoContract.getAddress();
  console.log("✅ CasinoEntropyConsumerV2 deployed to:", contractAddress);

  // Test the contract
  console.log("\n🧪 Testing contract...");
  try {
    const contractInfo = await casinoContract.getContractInfo();
    console.log("Contract Info:", {
      contractAddress: contractInfo.contractAddress,
      treasuryAddress: contractInfo.treasuryAddress,
      totalRequests: contractInfo.totalRequests.toString(),
      totalFulfilled: contractInfo.totalFulfilled.toString(),
      contractBalance: ethers.formatEther(contractInfo.contractBalance),
    });

    console.log("✅ Contract test completed successfully!");
  } catch (error) {
    console.log("⚠️  Contract test failed:", error.message);
    console.log("   This may be normal if the contract interface has changed");
  }

  // Save deployment info
  const deploymentInfo = {
    network: networkName,
    chainId: chainId,
    contractAddress: contractAddress,
    pythEntropyAddress: pythEntropyAddress,
    pythProviderAddress: pythProviderAddress,
    treasuryAddress: treasuryAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    transactionHash: casinoContract.deploymentTransaction()?.hash,
    explorer: {
      testnet: `https://shannon-explorer.somnia.network/address/${contractAddress}`,
      mainnet: `https://explorer.somnia.network/address/${contractAddress}`,
    }
  };

  console.log("\n📋 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Save to file
  const deploymentsDir = './deployments';
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  const networkSuffix = chainId === '5031' ? 'somnia-mainnet' : 'somnia-testnet';
  const filename = `${deploymentsDir}/casino-entropy-${networkSuffix}-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to:", filename);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📝 Next Steps:");
  console.log("1. Update .env.local with the contract address:");
  console.log(`   NEXT_PUBLIC_CASINO_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("2. Verify the contract on Somnia explorer:");
  if (chainId === '5031') {
    console.log(`   https://explorer.somnia.network/address/${contractAddress}`);
  } else {
    console.log(`   https://shannon-explorer.somnia.network/address/${contractAddress}`);
  }
  console.log("3. Fund the treasury address if needed:", treasuryAddress);
  console.log("4. Test the contract functionality");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

