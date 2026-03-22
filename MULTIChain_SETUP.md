# Multi-Chain Deployment Guide

## Supported Networks

| Network | Chain ID | Status | Purpose |
|---------|----------|--------|---------|
| Ethereum Mainnet | 1 | Configured | Production |
| Base | 8453 | Configured | Production (L2) |
| Base Sepolia | 84532 | Configured | Testing |

## Deployed Contracts

**None yet** - Deployment to Ethereum mainnet requires funding the deployer account first.

**Deployer Address:** `0x4615bBA7FfA62331fe49084A3801f9371B8c266E`

## How to Deploy to Ethereum Mainnet

### Prerequisites

1. Fund the deployer address with **0.02-0.05 ETH** (~$50-150 for gas)
2. Ensure `PRIVATE_KEY` in `.env` corresponds to the funded address

### Deployment Command

```bash
cd /home/sprite/trustr-protocol
npx hardhat run scripts/deploy.ts --network ethereum
```

### Post-Deployment

1. Contract addresses saved to: `deployments/ethereum.json`
2. Update `.env` with deployed addresses:
   ```
   ESCROW_ADDRESS=0x...
   ATTESTATION_REGISTRY_ADDRESS=0x...
   AGENT_IDENTITY_ADDRESS=0x...
   ```
3. Update frontend config files with new addresses

## Gas Cost Estimates

| Network | Deployment Gas | Avg. Gas Price | Est. Cost (USD) |
|---------|----------------|----------------|-----------------|
| Ethereum Mainnet | ~3,000,000 | 20-50 gwei | $50-150 |
| Base | ~3,000,000 | 0.1-1 gwei | $0.50-5 |
| Base Sepolia | ~3,000,000 | 0.1 gwei | $0 (testnet) |

## Recommended Networks

| Use Case | Recommended Network |
|----------|---------------------|
| Production deployment | **Base** (low fees, EVM-compatible) |
| Mainnet verification | **Ethereum** (highest security) |
| Testing/Development | **Base Sepolia** (free testnet) |

### Why Base for Production?

- 10-100x cheaper than Ethereum mainnet
- Same security model (secured by Ethereum)
- Growing ecosystem and adoption
- Perfect for frequent transactions (attestations, escrow operations)

## Quick Start for Testing

```bash
# Deploy to Base Sepolia (free)
npx hardhat run scripts/deploy.ts --network baseSepolia

# Verify deployment
cat deployments/baseSepolia.json
```

## Configuration

All network RPCs and explorers are pre-configured in `hardhat.config.ts`. Just add your credentials to `.env`:

```
# Required for all networks
PRIVATE_KEY=your_deployer_private_key

# Optional: Custom RPCs
ETHEREUM_RPC_URL=https://eth.llamarpc.com
BASE_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```
