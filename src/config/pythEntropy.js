/**
 * Pyth Entropy Configuration for Somnia Network
 * Configuration for Pyth Network Entropy random number generation
 */

export const PYTH_ENTROPY_CONFIG = {
  // Primary network - Somnia Testnet
  NETWORK: {
    chainId: 50312,
    name: 'Somnia Testnet',
    rpcUrl: process.env.NEXT_PUBLIC_SOMNIA_TESTNET_RPC || 'https://dream-rpc.somnia.network/',
    entropyContract: process.env.NEXT_PUBLIC_SOMNIA_PYTH_ENTROPY_CONTRACT || process.env.NEXT_PUBLIC_MONAD_PYTH_ENTROPY_CONTRACT || '0x36825bf3fbdf5a29e2d5148bfe7dcf7b5639e320',
    entropyProvider: process.env.NEXT_PUBLIC_SOMNIA_PYTH_ENTROPY_PROVIDER || process.env.NEXT_PUBLIC_MONAD_PYTH_ENTROPY_PROVIDER || '0x6CC14824Ea2918f5De5C2f75A9Da968ad4BD6344',
    explorerUrl: process.env.NEXT_PUBLIC_SOMNIA_TESTNET_EXPLORER || 'https://shannon-explorer.somnia.network/',
    entropyExplorerUrl: 'https://entropy-explorer.pyth.network/?chain=somnia-testnet&search=',
    currency: 'STT',
    currencySymbol: 'STT',
    currencyDecimals: 18
  },

  // Supported networks
  NETWORKS: {
    'somnia-testnet': {
      chainId: 50312,
      name: 'Somnia Testnet',
      rpcUrl: process.env.NEXT_PUBLIC_SOMNIA_TESTNET_RPC || 'https://dream-rpc.somnia.network/',
      entropyContract: process.env.NEXT_PUBLIC_SOMNIA_PYTH_ENTROPY_CONTRACT || '0x36825bf3fbdf5a29e2d5148bfe7dcf7b5639e320',
      entropyProvider: process.env.NEXT_PUBLIC_SOMNIA_PYTH_ENTROPY_PROVIDER || '0x6CC14824Ea2918f5De5C2f75A9Da968ad4BD6344',
      explorerUrl: process.env.NEXT_PUBLIC_SOMNIA_TESTNET_EXPLORER || 'https://shannon-explorer.somnia.network/',
      entropyExplorerUrl: 'https://entropy-explorer.pyth.network/?chain=somnia-testnet&search=',
      currency: 'STT',
      currencySymbol: 'STT',
      currencyDecimals: 18
    },
    'somnia-mainnet': {
      chainId: 5031,
      name: 'Somnia Mainnet',
      rpcUrl: process.env.NEXT_PUBLIC_SOMNIA_MAINNET_RPC || 'https://api.infra.mainnet.somnia.network/',
      entropyContract: process.env.NEXT_PUBLIC_SOMNIA_MAINNET_PYTH_ENTROPY_CONTRACT || '0x36825bf3fbdf5a29e2d5148bfe7dcf7b5639e320',
      entropyProvider: process.env.NEXT_PUBLIC_SOMNIA_MAINNET_PYTH_ENTROPY_PROVIDER || '0x6CC14824Ea2918f5De5C2f75A9Da968ad4BD6344',
      explorerUrl: process.env.NEXT_PUBLIC_SOMNIA_MAINNET_EXPLORER || 'https://explorer.somnia.network',
      entropyExplorerUrl: 'https://entropy-explorer.pyth.network/?chain=somnia-mainnet&search=',
      currency: 'SOMI',
      currencySymbol: 'SOMI',
      currencyDecimals: 18
    },
    // Legacy support for backward compatibility
    'somnia-testnet': {
      chainId: 50312,
      name: 'Somnia Testnet',
      rpcUrl: process.env.NEXT_PUBLIC_SOMNIA_TESTNET_RPC || 'https://dream-rpc.somnia.network/',
      entropyContract: process.env.NEXT_PUBLIC_SOMNIA_PYTH_ENTROPY_CONTRACT || '0x36825bf3fbdf5a29e2d5148bfe7dcf7b5639e320',
      entropyProvider: process.env.NEXT_PUBLIC_SOMNIA_PYTH_ENTROPY_PROVIDER || '0x6CC14824Ea2918f5De5C2f75A9Da968ad4BD6344',
      explorerUrl: process.env.NEXT_PUBLIC_SOMNIA_TESTNET_EXPLORER || 'https://shannon-explorer.somnia.network/',
      entropyExplorerUrl: 'https://entropy-explorer.pyth.network/?chain=somnia-testnet&search=',
      currency: 'STT',
      currencySymbol: 'STT',
      currencyDecimals: 18
    }
  },

  // Default network
  DEFAULT_NETWORK: 'somnia-testnet',

  // Game types supported
  GAME_TYPES: {
    MINES: 0,
    PLINKO: 1,
    ROULETTE: 2,
    WHEEL: 3
  },

  // Entropy request configuration
  REQUEST_CONFIG: {
    // Gas limit for entropy requests
    gasLimit: 500000,
    // Maximum gas price (in wei)
    maxGasPrice: '1000000000', // 1 gwei
    // Request timeout (in milliseconds)
    timeout: 30000,
    // Retry configuration
    maxRetries: 3,
    retryDelay: 1000
  },

  // Entropy Explorer configuration
  EXPLORER_CONFIG: {
    baseUrl: 'https://entropy-explorer.pyth.network',
    // Supported chains for explorer
    supportedChains: ['somnia-testnet', 'somnia-mainnet'],
    // Transaction link format
    transactionLinkFormat: 'https://entropy-explorer.pyth.network/tx/{txHash}',
    // Somnia Testnet specific explorer
    somniaTestnetUrl: 'https://entropy-explorer.pyth.network/?chain=somnia-testnet&search=',
    // Somnia Mainnet specific explorer
    somniaMainnetUrl: 'https://entropy-explorer.pyth.network/?chain=somnia-mainnet&search='
  },

  /**
   * Get network configuration by chain ID or name
   * @param {string|number} network - Network name or chain ID
   * @returns {Object} Network configuration
   */
  getNetworkConfig(network) {
    // Return Somnia Testnet or Mainnet configuration
    if (typeof network === 'number') {
      if (network === 50312) {
        return this.NETWORKS['somnia-testnet'];
      }
      if (network === 5031) {
        return this.NETWORKS['somnia-mainnet'];
      }
    }
    if (network === 'somnia-testnet' || network === 'somnia-testnet' || !network) {
      return this.NETWORKS['somnia-testnet'] || this.NETWORK;
    }
    if (network === 'somnia-mainnet') {
      return this.NETWORKS['somnia-mainnet'];
    }
    // Fallback to primary network (testnet)
    return this.NETWORK;
  },

  /**
   * Get entropy contract address for network
   * @param {string} network - Network name
   * @returns {string} Contract address
   */
  getEntropyContract(network) {
    const config = this.getNetworkConfig(network);
    return config.entropyContract;
  },

  /**
   * Get entropy provider address for network
   * @param {string} network - Network name
   * @returns {string} Provider address
   */
  getEntropyProvider(network) {
    const config = this.getNetworkConfig(network);
    return config.entropyProvider;
  },

  /**
   * Get explorer URL for transaction
   * @param {string} txHash - Transaction hash
   * @param {string} network - Network name
   * @returns {string} Explorer URL
   */
  getExplorerUrl(txHash, network) {
    const config = this.getNetworkConfig(network);
    return `${config.explorerUrl}/tx/${txHash}`;
  },

  /**
   * Get Entropy Explorer URL for transaction
   * @param {string} txHash - Transaction hash
   * @returns {string} Entropy Explorer URL
   */
  getEntropyExplorerUrl(txHash, network) {
    const config = this.getNetworkConfig(network);
    if (txHash) {
      const chainName = network === 'somnia-mainnet' || config.chainId === 5031 ? 'somnia-mainnet' : 'somnia-testnet';
      return `https://entropy-explorer.pyth.network/?chain=${chainName}&search=${txHash}`;
    }
    return config.entropyExplorerUrl;
  },

  /**
   * Validate network support
   * @param {string|number} network - Network name or chain ID
   * @returns {boolean} True if supported
   */
  isNetworkSupported(network) {
    if (typeof network === 'number') {
      return network === 50312 || network === 5031; // Somnia Testnet or Mainnet chain ID
    }
    return network === 'somnia-testnet' || network === 'somnia-mainnet' || network === 'somnia-testnet' || !network;
  },

  /**
   * Get all supported networks
   * @returns {Array} Array of network names
   */
  getSupportedNetworks() {
    return ['somnia-testnet', 'somnia-mainnet'];
  },

  /**
   * Get current network configuration
   * @returns {Object} Current network configuration
   */
  getCurrentNetwork() {
    return this.NETWORK;
  },

  /**
   * Check if current network is Somnia Testnet
   * @returns {boolean} True if Somnia Testnet
   */
  isSomniaTestnet() {
    return this.NETWORK.chainId === 50312;
  },

  /**
   * Check if current network is Somnia Mainnet
   * @returns {boolean} True if Somnia Mainnet
   */
  isSomniaMainnet() {
    return this.NETWORK.chainId === 5031;
  },

  // Legacy method for backward compatibility
  isMonadTestnet() {
    return this.isSomniaTestnet();
  }
};

export default PYTH_ENTROPY_CONFIG;
