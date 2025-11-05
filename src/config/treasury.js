import { getTreasuryPrivateKey, getTreasuryAddress } from '@/lib/walletUtils';

// Casino Treasury Configuration
// This file contains the treasury wallet address and related configuration

// Get treasury address (derived from mnemonic if available, otherwise from env or default)
let treasuryAddress;
let treasuryPrivateKey;

try {
  treasuryAddress = process.env.SOMNIA_TREASURY_ADDRESS || 
                    process.env.MONAD_TREASURY_ADDRESS || 
                    process.env.TREASURY_ADDRESS || 
                    getTreasuryAddress();
  treasuryPrivateKey = getTreasuryPrivateKey();
} catch (error) {
  // Fallback to defaults if mnemonic/private key not configured
  console.warn('⚠️ Treasury mnemonic/private key not configured, using defaults:', error.message);
  treasuryAddress = process.env.SOMNIA_TREASURY_ADDRESS || 
                    process.env.MONAD_TREASURY_ADDRESS || 
                    process.env.TREASURY_ADDRESS || 
                    '0x025182b20Da64b5997d09a5a62489741F68d9B96';
  treasuryPrivateKey = process.env.SOMNIA_TREASURY_PRIVATE_KEY || 
                        process.env.MONAD_TREASURY_PRIVATE_KEY || 
                        process.env.TREASURY_PRIVATE_KEY || 
                        '0x73e0cfb4d786d6e542533e18eb78fb5c727ab802b89c6850962042a8f0835f0c';
}

export const TREASURY_CONFIG = {
  // Somnia Testnet Treasury Wallet (for deposits/withdrawals)
  ADDRESS: treasuryAddress,
  
  // Private key derived from mnemonic (if TREASURY_MNEMONIC is set) or from env
  // ⚠️  DEVELOPMENT ONLY - Never use in production!
  PRIVATE_KEY: treasuryPrivateKey,
  
  // Network configuration for Somnia Testnet (for deposit/withdraw)
  NETWORK: {
    CHAIN_ID: '0xc48c', // Somnia testnet (50312 in hex)
    CHAIN_NAME: 'Somnia Testnet',
    RPC_URL: process.env.NEXT_PUBLIC_SOMNIA_TESTNET_RPC || process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC || 'https://dream-rpc.somnia.network/',
    EXPLORER_URL: process.env.NEXT_PUBLIC_SOMNIA_TESTNET_EXPLORER || process.env.NEXT_PUBLIC_MONAD_TESTNET_EXPLORER || 'https://shannon-explorer.somnia.network/'
  },
  
  // Mainnet network configuration
  MAINNET_NETWORK: {
    CHAIN_ID: '0x13a7', // Somnia mainnet (5031 in hex)
    CHAIN_NAME: 'Somnia Mainnet',
    RPC_URL: process.env.NEXT_PUBLIC_SOMNIA_MAINNET_RPC || 'https://api.infra.mainnet.somnia.network/',
    EXPLORER_URL: process.env.NEXT_PUBLIC_SOMNIA_MAINNET_EXPLORER || 'https://explorer.somnia.network'
  },
  
  // Gas settings for transactions
  GAS: {
    DEPOSIT_LIMIT: process.env.GAS_LIMIT_DEPOSIT ? '0x' + parseInt(process.env.GAS_LIMIT_DEPOSIT).toString(16) : '0x5208', // 21000 gas for simple ETH transfer
    WITHDRAW_LIMIT: process.env.GAS_LIMIT_WITHDRAW ? '0x' + parseInt(process.env.GAS_LIMIT_WITHDRAW).toString(16) : '0x186A0', // 100000 gas for more complex operations
  },
  
  // Minimum and maximum deposit amounts (in STT for testnet, SOMI for mainnet)
  LIMITS: {
    MIN_DEPOSIT: parseFloat(process.env.MIN_DEPOSIT) || 0.001, // 0.001 STT/SOMI minimum
    MAX_DEPOSIT: parseFloat(process.env.MAX_DEPOSIT) || 100, // 100 STT/SOMI maximum
  }
};

// Helper function to validate treasury address
export const isValidTreasuryAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Helper function to get treasury info
export const getTreasuryInfo = () => {
  return {
    address: TREASURY_CONFIG.ADDRESS,
    network: TREASURY_CONFIG.NETWORK.CHAIN_NAME,
    chainId: TREASURY_CONFIG.NETWORK.CHAIN_ID
  };
};
