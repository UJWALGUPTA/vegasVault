// Somnia Testnet Configuration
export const somniaTestnetConfig = {
  id: 50312,
  name: 'Somnia Testnet',
  network: 'somnia-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Somnia Test Token',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network/'],
    },
    public: {
      http: ['https://dream-rpc.somnia.network/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Shannon Explorer',
      url: 'https://shannon-explorer.somnia.network/',
    },
  },
  testnet: true,
};

// Somnia Mainnet Configuration
export const somniaMainnetConfig = {
  id: 5031,
  name: 'Somnia Mainnet',
  network: 'somnia-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Somnia',
    symbol: 'SOMI',
  },
  rpcUrls: {
    default: {
      http: ['https://api.infra.mainnet.somnia.network/'],
    },
    public: {
      http: ['https://api.infra.mainnet.somnia.network/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://explorer.somnia.network',
    },
  },
  testnet: false,
};

export const somniaTestnetTokens = {
  STT: {
    address: 'native',
    decimals: 18,
    symbol: 'STT',
    name: 'Somnia Test Token',
    isNative: true,
  },
};

export const somniaMainnetTokens = {
  SOMI: {
    address: 'native',
    decimals: 18,
    symbol: 'SOMI',
    name: 'Somnia',
    isNative: true,
  },
};

// Legacy exports for backward compatibility
export const monadTestnetConfig = somniaTestnetConfig;
export const monadTestnetTokens = somniaTestnetTokens;

export default somniaTestnetConfig;