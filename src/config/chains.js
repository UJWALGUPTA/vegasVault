/**
 * Custom Chain Definitions
 * Defines custom chains not included in wagmi/chains
 */

import { defineChain } from 'viem';

// Somnia Testnet Chain Definition
export const somniaTestnet = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
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
});

// Somnia Mainnet Chain Definition
export const somniaMainnet = defineChain({
  id: 5031,
  name: 'Somnia Mainnet',
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
});

// Legacy export for backward compatibility
export const monadTestnet = somniaTestnet;

export default {
  somniaTestnet,
  somniaMainnet,
  monadTestnet, // Legacy alias
};