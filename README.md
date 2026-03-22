# Trustr Protocol 🛡️

**Trustless Escrow Payments for Humans & AI Agents**

Trustr is a policy-governed escrow payment protocol that guarantees payment on delivery for freelance work and AI agent services. Built on Base with integrated support for MetaMask SDK, Locus, Uniswap, and Venice AI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Base](https://img.shields.io/badge/Base-0052FF?style=flat&logo=base&logoColor=white)](https://base.org)
[![Hackathon](https://img.shields.io/badge/Hackathon-Synthesis%202026-blue)](https://synthesis.md)

---

## 🎯 The Problem

Freelancers and AI service providers face **payment fraud and delayed payments**:
- Clients disappear after work is delivered
- Traditional escrow charges 5-10% fees
- No trustless system for "payment on delivery"
- AI agents lack standardized payment infrastructure

## ✨ The Solution

**Trustr Protocol** provides:
- ✅ **Trustless escrow** with 0.5% platform fees (10x cheaper than alternatives)
- ✅ **AI + Human verification** via Venice AI uncensored models
- ✅ **Native agent support** — AI agents can be providers and verifiers
- ✅ **Multi-token payments** — accept ETH, USDC, DAI (auto-swap via Uniswap)
- ✅ **Policy-governed wallets** — spending limits via Locus + MetaMask SDK
- ✅ **Instant settlement** on Base (sub-second finality, <$0.01 gas)

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Trustr Protocol                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐     ┌──────────────┐     ┌──────────────┐ │
│  │   Client    │     │   Provider   │     │   Verifier   │ │
│  │  (Human)    │     │ (Human/AI)   │     │  (AI Agent)  │ │
│  └──────┬──────┘     └──────┬───────┘     └──────┬───────┘ │
│         │                   │                     │          │
│         │  MetaMask SDK     │  Locus Agent Wallet │          │
│         │  (Policy Wallet)  │  (Spending Rules)   │          │
│         ▼                   ▼                     ▼          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Base Smart Contracts                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │   Escrow     │  │  Attestation │  │   Agent      │  │ │
│  │  │  Contract    │  │   Registry   │  │   Identity   │  │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │ │
│  └─────────┼─────────────────┼─────────────────┼──────────┘ │
│            │                 │                 │             │
│            ▼                 ▼                 ▼             │
│  ┌──────────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │   Uniswap v4     │ │  Venice AI   │ │   Locus      │    │
│  │  (Token Swaps)   │ │(Verification)│ │ (Payments)   │    │
│  └──────────────────┘ └──────────────┘ └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌐 Live Deployment

### Frontend
- **Production:** https://trustr-protocol.vercel.app

### Smart Contracts (Base Sepolia Testnet)
All contracts are verified on Basescan:

| Contract | Address | Basescan |
|----------|---------|----------|
| Escrow | `0x819Bd6587CeA94d90cCd5c77FfC5014CdA83A947` | [View](https://sepolia.basescan.org/address/0x819Bd6587CeA94d90cCd5c77FfC5014CdA83A947) |
| AttestationRegistry | `0x1729F91C8327E1f4C6d740735E8a34e39bd6953b` | [View](https://sepolia.basescan.org/address/0x1729F91C8327E1f4C6d740735E8a34e39bd6953b) |
| AgentIdentity | `0xE9cC05ba1D6ee0190e33c477580CCAf9e318c047` | [View](https://sepolia.basescan.org/address/0xE9cC05ba1D6ee0190e33c477580CCAf9e318c047) |

**Network:** Base Sepolia (Chain ID: 84532)

---

## 📦 Smart Contracts

### Escrow.sol
Core escrow contract for trustless job payments.

**Key Functions:**
- `createJob()` — Create escrow job with payment
- `submitWork()` — Provider submits deliverable
- `verifyWork()` — Client verifies work
- `releasePayment()` — Release funds to provider
- `openDispute()` — Open dispute for resolution
- `resolveDispute()` — Arbiter resolves dispute

### AttestationRegistry.sol
Reputation and attestation tracking.

**Features:**
- On-chain attestation storage
- Reputation scoring (0-1000)
- Verifier approval system

### AgentIdentity.sol
ERC-8004 compatible agent registration.

**Features:**
- AI agent identity registration
- Capability declaration
- Reputation tracking

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask wallet
- Base Sepolia ETH (for testing)

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/trustr-protocol.git
cd trustr-protocol

# Install dependencies
npm install
cd frontend && npm install && cd ..

# Configure environment
cp .env.example .env
# Edit .env with your API keys and private key
```

### Environment Variables

```bash
# Base Blockchain
PRIVATE_KEY=your_private_key
BASESCAN_API_KEY=your_basescan_api_key

# Locus API
LOCUS_API_KEY=your_locus_api_key

# Venice AI
VENICE_API_KEY=your_venice_api_key
```

### Deploy Contracts

```bash
# Compile contracts
npm run compile

# Deploy to Base Sepolia
npm run deploy:base-sepolia

# Deploy to Base Mainnet
npm run deploy:base
```

### Run Frontend

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000`

---

## 🤝 Partner Integrations

### Base
- **Deployment:** Base mainnet + Sepolia testnet
- **Benefits:** Low fees (<$0.01/tx), instant finality, Coinbase ecosystem
- **Track:** Base Track

### MetaMask SDK
- **Integration:** Wallet connection, Smart Accounts, ERC-7715 delegations
- **Features:** Policy-governed spending, gasless transactions
- **Track:** MetaMask SDK Track

### Locus
- **Integration:** Agent wallets, spending policies, micropayments
- **Features:** Agent registration, budget limits, escrow coordination
- **Track:** Locus Track

### Uniswap
- **Integration:** Multi-token payments via Universal Router
- **Features:** Auto-swap to USDC, v4 hooks, liquidity management
- **Track:** Uniswap Track

### Venice AI
- **Integration:** Uncensored AI verification, ZK-proofs, web citations
- **Features:** Work validation, dispute analysis, quality assessment
- **Track:** Venice Track

---

## 📖 API Reference

### Escrow Contract

```typescript
// Create job
const jobId = await escrow.createJob(
  providerAddress,
  "Build web app",
  ethers.parseEther("0.1"),
  ETH_ADDRESS,
  deadlineTimestamp,
  1, // AI verification
  "ipfs://metadata"
);

// Submit work
await escrow.submitWork(
  jobId,
  "ipfs://deliverable-hash",
  "ipfs://ai-attestation"
);

// Verify work
await escrow.verifyWork(jobId, true, "Quality work delivered");

// Release payment
await escrow.releasePayment(jobId);
```

### Locus Client

```typescript
import { locusClient } from './lib/locus';

// Create agent wallet
const wallet = await locusClient.createAgentWallet(
  "MyAgent",
  ownerAddress
);

// Set spending policy
await locusClient.setSpendingPolicy(wallet.address, {
  type: 'daily_limit',
  limit: '100',
  period: 'day',
  enabled: true
});

// Execute micropayment
await locusClient.executeMicropayment(
  wallet.address,
  recipientAddress,
  "0.01",
  "ETH",
  jobId
);
```

### Venice AI Client

```typescript
import { veniceClient } from './lib/venice';

// Verify work with AI
const result = await veniceClient.verifyWork(
  deliverableContent,
  ["Requirements 1", "Requirements 2"]
);

console.log(result.approved); // true/false
console.log(result.confidence); // 0-1
console.log(result.citations); // Web sources

// Generate attestation
const attestation = await veniceClient.generateAttestation(
  jobId,
  deliverableHash,
  jobDescription,
  requirements
);
```

---

## 🎯 Use Cases

### For Humans
1. **Freelancers:** Guarantee payment for your work
2. **Clients:** Secure fund escrow until delivery
3. **Verifiers:** Earn fees for dispute resolution

### For AI Agents
1. **Service Providers:** Offer AI services with guaranteed payment
2. **Verifiers:** AI-powered quality assessment
3. **Arbitrators:** Unbiased dispute resolution

---

## 🔒 Security

- **Audited contracts:** OpenZeppelin standards
- **ReentrancyGuard:** Protection against reentrancy attacks
- **Access control:** Role-based permissions
- **Emergency withdrawal:** Owner-only safety valve

---

## 📊 Token Economics

| Fee Type | Amount | Recipient |
|----------|--------|----------|
| Platform Fee | 0.5% | Protocol Treasury |
| Verifier Fee | 1-2% | AI/Human Verifiers |
| Gas Fees | ~$0.01 | Base Validators |

**Total cost to users: <1%** (vs 5-10% for traditional escrow)

---

## 🗺 Roadmap

**Phase 1 (Hackathon)** ✅
- Core escrow contract
- Frontend MVP
- Partner integrations
- Hackathon submission

**Phase 2 (Post-Hackathon)**
- Mobile app
- Enhanced AI verification
- DAO governance
- Multi-chain expansion

**Phase 3 (Scale)**
- Enterprise partnerships
- Advanced dispute resolution
- Reputation NFT badges
- Cross-chain bridges

---

## 🏆 Hackathon Tracks

Trustr is submitted to:
- ✅ **Open Track** — General innovation
- ✅ **Base Track** — Best Base deployment
- ✅ **MetaMask SDK Track** — Best MetaMask integration
- ✅ **Locus Track** — Best agent payment use case
- ✅ **Uniswap Track** — Best DeFi integration
- ✅ **Venice Track** — Best privacy/AI use case
- ✅ **College.xyz Track** — Student building track

---

## 📄 License

MIT License — see [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

Built for the Synthesis Hackathon 2026.

Special thanks to:
- Base team for amazing L2 infrastructure
- MetaMask for SDK and Smart Accounts
- Locus for agent wallet infrastructure
- Uniswap for DeFi primitives
- Venice AI for uncensored verification

---

## 📬 Contact

- **Website:** https://trustr.gg
- **Twitter:** @trustrprotocol
- **Discord:** [Join Discord](https://discord.gg/trustr)
- **Email:** hello@trustr.gg

---

**Built with ❤️ on Base**
