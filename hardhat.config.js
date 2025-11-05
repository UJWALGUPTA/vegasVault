require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: '.env.local' });
const { ethers } = require("ethers");

// Helper function to get accounts from mnemonic or private key
function getAccounts() {
  const mnemonic = process.env.TREASURY_MNEMONIC || 
                   process.env.SOMNIA_TREASURY_MNEMONIC || 
                   process.env.MONAD_TREASURY_MNEMONIC;
  
  if (mnemonic) {
    // Derive private key from mnemonic (account index 0)
    try {
      const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic.trim(), "", "m/44'/60'/0'/0/0");
      return [hdNode.privateKey];
    } catch (error) {
      console.warn('⚠️ Failed to derive account from mnemonic, falling back to private key:', error.message);
    }
  }
  
  // Fallback to direct private key
  const privateKey = process.env.TREASURY_PRIVATE_KEY || 
                     process.env.SOMNIA_TREASURY_PRIVATE_KEY || 
                     process.env.MONAD_TREASURY_PRIVATE_KEY;
  
  return privateKey ? [privateKey] : [];
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    'arbitrum-sepolia': {
      url: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC || "https://sepolia-rollup.arbitrum.io/rpc",
      accounts: ["0x080c0b0dc7aa27545fab73d29b06f33e686d1491aef785bf5ced325a32c14506"],
      chainId: 421614,
      timeout: 120000, // 2 minutes
      httpHeaders: {
        "User-Agent": "hardhat"
      }
    },
    'arbitrum-one': {
      url: process.env.NEXT_PUBLIC_ARBITRUM_ONE_RPC || "https://arb1.arbitrum.io/rpc",
      accounts: getAccounts(),
      chainId: 42161,
      timeout: 120000,
      httpHeaders: {
        "User-Agent": "hardhat"
      }
    },
    'somnia-testnet': {
      url: process.env.NEXT_PUBLIC_SOMNIA_TESTNET_RPC || process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC || "https://dream-rpc.somnia.network/",
      accounts: getAccounts(),
      chainId: 50312,
      timeout: 120000,
      httpHeaders: {
        "User-Agent": "hardhat"
      }
    },
    'somnia-mainnet': {
      url: process.env.NEXT_PUBLIC_SOMNIA_MAINNET_RPC || "https://api.infra.mainnet.somnia.network/",
      accounts: getAccounts(),
      chainId: 5031,
      timeout: 120000,
      httpHeaders: {
        "User-Agent": "hardhat"
      }
    },
    // Legacy alias for backward compatibility
    'monad-testnet': {
      url: process.env.NEXT_PUBLIC_SOMNIA_TESTNET_RPC || process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC || "https://dream-rpc.somnia.network/",
      accounts: getAccounts(),
      chainId: 50312,
      timeout: 120000,
      httpHeaders: {
        "User-Agent": "hardhat"
      }
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: {
      arbitrumSepolia: process.env.ARBISCAN_API_KEY || "",
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};