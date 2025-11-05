/**
 * Somnia Testnet Configuration
 * Configuration for Somnia Testnet with STT token
 */

// Somnia Testnet Chain Configuration
export const SOMNIA_TESTNET_CONFIG = {
  chainId: 50312,
  name: 'Somnia Testnet',
  network: 'somnia-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Somnia Test Token',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_SOMNIA_TESTNET_RPC || 'https://dream-rpc.somnia.network/',
      ],
    },
    public: {
      http: [
        'https://dream-rpc.somnia.network/',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Shannon Explorer',
      url: process.env.NEXT_PUBLIC_SOMNIA_TESTNET_EXPLORER || 'https://shannon-explorer.somnia.network/',
    },
  },
  testnet: true,
};

// Somnia Testnet Tokens
export const SOMNIA_TESTNET_TOKENS = {
  STT: {
    symbol: 'STT',
    name: 'Somnia Test Token',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
    isNative: true,
    icon: '🔮',
    faucet: 'https://faucet.0g.ai'
  }
};

// Casino configuration for Somnia Testnet
export const SOMNIA_TESTNET_CASINO_CONFIG = {
  // Deposit/Withdraw settings
  minDeposit: '0.001', // 0.001 STT
  maxDeposit: '100',   // 100 STT
  minWithdraw: '0.001', // 0.001 STT
  maxWithdraw: '100',   // 100 STT
  
  // Game settings (same as Arbitrum for consistency)
  games: {
    MINES: {
      minBet: '0.001',
      maxBet: '1.0',
      minMines: 1,
      maxMines: 24,
      defaultMines: 3,
      gridSize: 25
    },
    ROULETTE: {
      minBet: '0.001',
      maxBet: '1.0',
      houseEdge: 0.027
    },
    PLINKO: {
      minBet: '0.001',
      maxBet: '1.0',
      rows: [8, 12, 16],
      defaultRows: 12
    },
    WHEEL: {
      minBet: '0.001',
      maxBet: '1.0',
      segments: [2, 10, 20, 40, 50]
    }
  }
};

// Network switching helper for Somnia Testnet
export const switchToSomniaTestnet = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not found');
  }

  try {
    // Try to switch to Somnia Testnet
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xc48c' }], // 50312 in hex
    });
  } catch (switchError) {
    // If network doesn't exist, add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0xc48c',
          chainName: 'Somnia Testnet',
          nativeCurrency: {
            name: 'Somnia Test Token',
            symbol: 'STT',
            decimals: 18,
          },
          rpcUrls: ['https://dream-rpc.somnia.network/'],
          blockExplorerUrls: ['https://shannon-explorer.somnia.network/'],
        }],
      });
    } else {
      throw switchError;
    }
  }
};

// Legacy export for backward compatibility
export const switchToOGGalileo = switchToSomniaTestnet;
export const STTAD_TESTNET_CONFIG = SOMNIA_TESTNET_CONFIG;
export const STTAD_TESTNET_TOKENS = SOMNIA_TESTNET_TOKENS;
export const STTAD_TESTNET_CASINO_CONFIG = SOMNIA_TESTNET_CASINO_CONFIG;

export default SOMNIA_TESTNET_CONFIG;