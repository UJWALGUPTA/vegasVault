import { ethers } from 'ethers';

/**
 * Get treasury private key from mnemonic or direct private key
 * Supports both mnemonic phrases (recommended) and direct private keys (legacy)
 * 
 * @param {number} accountIndex - Account index to derive from mnemonic (default: 0)
 * @returns {string} Private key in hex format (0x...)
 */
export function getTreasuryPrivateKey(accountIndex = 0) {
  // Priority: mnemonic > direct private key
  const mnemonic = process.env.TREASURY_MNEMONIC || 
                   process.env.SOMNIA_TREASURY_MNEMONIC || 
                   process.env.MONAD_TREASURY_MNEMONIC;
  
  if (mnemonic) {
    try {
      // Derive wallet from mnemonic using standard BIP44 path: m/44'/60'/0'/0/{accountIndex}
      // This validates the mnemonic automatically
      const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic.trim(), "", `m/44'/60'/0'/0/${accountIndex}`);
      return hdNode.privateKey;
    } catch (error) {
      throw new Error(`Failed to derive private key from mnemonic: ${error.message}`);
    }
  }
  
  // Fallback to direct private key (for backward compatibility)
  const privateKey = process.env.TREASURY_PRIVATE_KEY || 
                     process.env.SOMNIA_TREASURY_PRIVATE_KEY || 
                     process.env.MONAD_TREASURY_PRIVATE_KEY;
  
  if (privateKey) {
    return privateKey;
  }
  
  throw new Error('Treasury mnemonic or private key not configured. Set TREASURY_MNEMONIC or TREASURY_PRIVATE_KEY environment variable.');
}

/**
 * Get treasury wallet from mnemonic or direct private key
 * 
 * @param {ethers.Provider} provider - Ethers provider instance
 * @param {number} accountIndex - Account index to derive from mnemonic (default: 0)
 * @returns {ethers.Wallet} Wallet instance
 */
export function getTreasuryWallet(provider, accountIndex = 0) {
  const privateKey = getTreasuryPrivateKey(accountIndex);
  return new ethers.Wallet(privateKey, provider);
}

/**
 * Get treasury address from mnemonic or direct private key
 * 
 * @param {number} accountIndex - Account index to derive from mnemonic (default: 0)
 * @returns {string} Treasury address
 */
export function getTreasuryAddress(accountIndex = 0) {
  const privateKey = getTreasuryPrivateKey(accountIndex);
  const wallet = new ethers.Wallet(privateKey);
  return wallet.address;
}

