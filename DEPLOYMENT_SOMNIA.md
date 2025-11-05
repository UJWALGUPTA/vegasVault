# Deployment Guide for Somnia Network

This guide explains how to deploy the VegasVault smart contracts to Somnia Network.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Hardhat** installed globally or locally
3. **Somnia Testnet/Mainnet tokens** (STT for testnet, SOMI for mainnet)
4. **Private Key** for deployment (keep secure!)

## Environment Setup

Create a `.env.local` file in the project root:

```bash
# Somnia Network Configuration
NEXT_PUBLIC_SOMNIA_TESTNET_RPC=https://dream-rpc.somnia.network/
NEXT_PUBLIC_SOMNIA_MAINNET_RPC=https://api.infra.mainnet.somnia.network/

# Treasury Configuration
SOMNIA_TREASURY_ADDRESS=0xYourTreasuryAddress
SOMNIA_TREASURY_PRIVATE_KEY=0xYourPrivateKey

# Pyth Entropy Configuration (update with actual addresses)
NEXT_PUBLIC_SOMNIA_PYTH_ENTROPY_CONTRACT=0x36825bf3fbdf5a29e2d5148bfe7dcf7b5639e320
NEXT_PUBLIC_SOMNIA_PYTH_ENTROPY_PROVIDER=0x6CC14824Ea2918f5De5C2f75A9Da968ad4BD6344

# Contract Address (will be set after deployment)
NEXT_PUBLIC_CASINO_CONTRACT_ADDRESS=
```

## Network Configuration

### Somnia Testnet
- **Chain ID**: 50312
- **RPC URL**: https://dream-rpc.somnia.network/
- **Explorer**: https://shannon-explorer.somnia.network/
- **Currency**: STT (Somnia Test Token)
- **Faucet**: https://testnet.somnia.network/

### Somnia Mainnet
- **Chain ID**: 5031
- **RPC URL**: https://api.infra.mainnet.somnia.network/
- **Explorer**: https://explorer.somnia.network
- **Currency**: SOMI
- **Faucet**: https://stakely.io/faucet/somnia-somi

## Deployment Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Compile Contracts

```bash
npx hardhat compile
```

### 3. Deploy to Somnia Testnet

```bash
# Set network to Somnia Testnet
npx hardhat run scripts/deploy-somnia.js --network somnia-testnet
```

Or use the dedicated deployment script:

```bash
npx hardhat run scripts/deploy-somnia.js --network somnia-testnet
```

### 4. Deploy to Somnia Mainnet

```bash
npx hardhat run scripts/deploy-somnia.js --network somnia-mainnet
```

**⚠️ WARNING**: Only deploy to mainnet after thorough testing on testnet!

## Deployment Script

The `scripts/deploy-somnia.js` script will:

1. ✅ Check network configuration
2. ✅ Verify deployer account balance
3. ✅ Deploy `CasinoEntropyConsumerV2` contract
4. ✅ Verify contract deployment
5. ✅ Test contract functionality
6. ✅ Save deployment info to `deployments/` directory

## Post-Deployment Steps

### 1. Update Environment Variables

After deployment, update your `.env.local`:

```bash
NEXT_PUBLIC_CASINO_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

### 2. Verify Contract on Explorer

**Testnet:**
```
https://shannon-explorer.somnia.network/address/0xYourContractAddress
```

**Mainnet:**
```
https://explorer.somnia.network/address/0xYourContractAddress
```

### 3. Fund Treasury

Ensure your treasury address has sufficient STT (testnet) or SOMI (mainnet) for:
- Contract operations
- User withdrawals
- Gas fees (if not using gasless transactions)

### 4. Test Contract Functions

Use the Hardhat console or write test scripts:

```bash
npx hardhat console --network somnia-testnet
```

## Contract Addresses

After deployment, the script saves deployment info to:
```
deployments/casino-entropy-somnia-testnet-{timestamp}.json
deployments/casino-entropy-somnia-mainnet-{timestamp}.json
```

Each deployment file contains:
- Contract address
- Network information
- Treasury address
- Pyth Entropy addresses
- Transaction hash
- Explorer links

## Troubleshooting

### Insufficient Balance
```
Error: insufficient funds for gas
```
**Solution**: Fund your deployer account with STT/SOMI tokens from the faucet.

### Network Not Found
```
Error: Network somnia-testnet not found
```
**Solution**: Ensure `hardhat.config.js` includes Somnia network configuration.

### Pyth Entropy Not Found
```
Warning: No contract found at Pyth Entropy address
```
**Solution**: Verify Pyth Entropy contract address is correct for Somnia network.

## Security Checklist

Before deploying to mainnet:

- [ ] All tests pass
- [ ] Contract audited
- [ ] Private keys secured (never commit to git)
- [ ] Treasury address verified
- [ ] Pyth Entropy addresses confirmed
- [ ] Environment variables set correctly
- [ ] Deployment script tested on testnet
- [ ] Contract verified on explorer

## Support

For issues or questions:
- Check [Somnia Documentation](https://docs.somnia.network/)
- Join [Somnia Discord](https://discord.gg/somnia)
- Review contract code in `contracts/` directory

## Additional Resources

- [Somnia Network Info](https://docs.somnia.network/developer/network-info)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Pyth Network Entropy](https://docs.pyth.network/entropy)

