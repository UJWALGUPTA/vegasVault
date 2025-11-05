// Network utilities for Somnia Network
import { somniaTestnet, somniaMainnet } from '@/config/chains';

export const SOMNIA_TESTNET_CONFIG = {
  chainId: '0xc48c', // 50312 in hex
  chainName: 'Somnia Testnet',
  nativeCurrency: {
    name: 'Somnia Test Token',
    symbol: 'STT',
    decimals: 18,
  },
  rpcUrls: ['https://dream-rpc.somnia.network/'],
  blockExplorerUrls: ['https://shannon-explorer.somnia.network/'],
};

export const SOMNIA_MAINNET_CONFIG = {
  chainId: '0x13a7', // 5031 in hex
  chainName: 'Somnia Mainnet',
  nativeCurrency: {
    name: 'Somnia',
    symbol: 'SOMI',
    decimals: 18,
  },
  rpcUrls: ['https://api.infra.mainnet.somnia.network/'],
  blockExplorerUrls: ['https://explorer.somnia.network'],
};

export const switchToSomniaTestnet = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Try to switch to Somnia Testnet
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SOMNIA_TESTNET_CONFIG.chainId }],
    });
  } catch (switchError) {
    // If the chain is not added, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [SOMNIA_TESTNET_CONFIG],
        });
      } catch (addError) {
        throw new Error('Failed to add Somnia Testnet to MetaMask');
      }
    } else {
      throw new Error('Failed to switch to Somnia Testnet');
    }
  }
};

export const switchToSomniaMainnet = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Try to switch to Somnia Mainnet
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SOMNIA_MAINNET_CONFIG.chainId }],
    });
  } catch (switchError) {
    // If the chain is not added, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [SOMNIA_MAINNET_CONFIG],
        });
      } catch (addError) {
        throw new Error('Failed to add Somnia Mainnet to MetaMask');
      }
    } else {
      throw new Error('Failed to switch to Somnia Mainnet');
    }
  }
};

// Legacy exports for backward compatibility
export const STTAD_TESTNET_CONFIG = SOMNIA_TESTNET_CONFIG;
export const switchToMonadTestnet = switchToSomniaTestnet;

export const isSomniaTestnet = (chainId) => {
  return chainId === 50312 || chainId === '0xc48c';
};

export const isSomniaMainnet = (chainId) => {
  return chainId === 5031 || chainId === '0x13a7';
};

export const isSomniaNetwork = (chainId) => {
  return isSomniaTestnet(chainId) || isSomniaMainnet(chainId);
};

// Legacy export for backward compatibility
export const isMonadTestnet = isSomniaTestnet;

export const formatSomiBalance = (balance, decimals = 5) => {
  const numBalance = parseFloat(balance || '0');
  return `${numBalance.toFixed(decimals)} SOMI`;
};

export const formatSttBalance = (balance, decimals = 5) => {
  const numBalance = parseFloat(balance || '0');
  return `${numBalance.toFixed(decimals)} STT`;
};

// Legacy export for backward compatibility
export const formatMonBalance = formatSttBalance;

export const getSomniaTestnetExplorerUrl = (txHash) => {
  return `https://shannon-explorer.somnia.network/tx/${txHash}`;
};

export const getSomniaMainnetExplorerUrl = (txHash) => {
  return `https://explorer.somnia.network/tx/${txHash}`;
};

// Legacy export for backward compatibility
export const getMonadTestnetExplorerUrl = getSomniaTestnetExplorerUrl;