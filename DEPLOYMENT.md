# Trustr Protocol — Deployment Guide 🚀

Complete guide for deploying Trustr to production.

---

## Prerequisites

### Required Accounts

1. **MetaMask wallet** with ETH for gas
2. **Base Sepolia ETH** — Get from [Base Faucet](https://faucet.base.org)
3. **Basescan API key** — Get from [Basescan](https://basescan.org/myapikey)
4. **Locus API key** — Get from [Locus Dashboard](https://locus.chat)
5. **Venice AI API key** — Get from [Venice AI](https://venice.ai)

### System Requirements

- Node.js 18+
- npm or yarn
- Git

---

## Step 1: Clone and Install

```bash
# Clone repository
git clone https://github.com/your-username/trustr-protocol.git
cd trustr-protocol

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

---

## Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env
```

### Environment Variables

```bash
# Base Blockchain
PRIVATE_KEY=your_deployer_private_key
BASESCAN_API_KEY=your_basescan_api_key

# Locus API
LOCUS_API_KEY=your_locus_api_key
NEXT_PUBLIC_LOCUS_API_URL=https://api.locus.chat

# Venice AI
VENICE_API_KEY=your_venice_api_key
NEXT_PUBLIC_VENICE_API_URL=https://api.venice.ai

# Frontend Contract Addresses (update after deployment)
NEXT_PUBLIC_ESCROW_ADDRESS=0x...
NEXT_PUBLIC_ATTESTATION_ADDRESS=0x...
NEXT_PUBLIC_AGENT_IDENTITY_ADDRESS=0x...
```

**Security Note:** Never commit `.env` to git. It's in `.gitignore`.

---

## Step 3: Deploy Smart Contracts

### Compile Contracts

```bash
npm run compile
```

Expected output:
```
Compiled 3 Solidity files successfully
```

### Deploy to Base Sepolia (Testnet)

```bash
npm run deploy:base-sepolia
```

Expected output:
```
🚀 Deploying Trustr Protocol to Base...
Deploying with account: 0xYourAddress

📦 Deploying Escrow contract...
✅ Escrow deployed to: 0xEscrowAddress

📦 Deploying AttestationRegistry contract...
✅ AttestationRegistry deployed to: 0xAttestationAddress

📦 Deploying AgentIdentity contract...
✅ AgentIdentity deployed to: 0xAgentIdentityAddress

🎉 Trustr Protocol Deployment Complete!
```

### Verify Contracts on Basescan

```bash
npx hardhat verify --network baseSepolia <ESCROW_ADDRESS>
npx hardhat verify --network baseSepolia <ATTESTATION_ADDRESS>
npx hardhat verify --network baseSepolia <AGENT_IDENTITY_ADDRESS>
```

### Deploy to Base Mainnet (Production)

```bash
npm run deploy:base
```

**⚠️ Warning:** Mainnet deployment costs real ETH. Test on Sepolia first.

---

## Step 4: Update Frontend Configuration

After deployment, update frontend environment:

```bash
# Edit frontend/.env.local
NEXT_PUBLIC_ESCROW_ADDRESS=0xYourEscrowAddress
NEXT_PUBLIC_ATTESTATION_ADDRESS=0xYourAttestationAddress
NEXT_PUBLIC_AGENT_IDENTITY_ADDRESS=0xYourAgentIdentityAddress
NEXT_PUBLIC_LOCUS_API_KEY=your_locus_api_key
NEXT_PUBLIC_VENICE_API_KEY=your_venice_api_key
```

---

## Step 5: Deploy Frontend

### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

Follow prompts to:
1. Link to Vercel account
2. Set environment variables
3. Deploy

You'll get a URL like: `https://trustr-protocol.vercel.app`

### Option B: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build frontend
cd frontend
npm run build

# Deploy
netlify deploy --prod --dir=build
```

### Option C: Self-Host

```bash
# Build frontend
cd frontend
npm run build

# Serve with nginx or similar
npm run start
```

---

## Step 6: Register AI Agent (Optional)

Register your verifier agent:

```bash
npx hardhat run scripts/register-agent.ts --network baseSepolia
```

Update `scripts/register-agent.ts` with:
- Your agent wallet address
- Agent name and description
- Capabilities array
- Metadata URI (IPFS)

---

## Step 7: Test Integration

### Test Job Creation

1. Open deployed frontend URL
2. Connect MetaMask wallet
3. Switch to Base Sepolia network
4. Click "Create Job"
5. Fill form:
   - Provider: Any address (can be your own)
   - Amount: 0.01 ETH
   - Token: ETH
   - Deadline: Tomorrow
   - Verification: AI
6. Submit transaction
7. Wait for confirmation
8. Verify job appears in "My Jobs"

### Test All Flows

- [ ] Wallet connection
- [ ] Job creation
- [ ] Job submission (as provider)
- [ ] Work verification (as client)
- [ ] Payment release
- [ ] Agent registration
- [ ] Error handling (try invalid inputs)

---

## Step 8: Monitor and Maintain

### Contract Monitoring

Use Basescan to monitor:
- Transaction volume
- Contract balance
- Events emitted

**URL:** `https://sepolia.basescan.org/address/<CONTRACT_ADDRESS>`

### Error Logging

Set up monitoring:
- Frontend errors: Sentry or LogRocket
- Contract events: The Graph or Alchemy Notify
- API failures: Locus + Venice dashboards

### Security Best Practices

1. **Never share private keys**
2. **Use multisig for production** (recommend Gnosis Safe)
3. **Set up emergency pause** (consider adding Pausable pattern)
4. **Monitor for anomalies** (unusual transaction patterns)
5. **Keep contracts upgradeable** (consider OpenZeppelin Upgrades)

---

## Troubleshooting

### Common Issues

**Contract deployment fails**
- Check you have enough ETH for gas
- Verify PRIVATE_KEY is correct (no spaces, 0x prefix)
- Ensure Base Sepolia RPC is accessible

**Frontend can't connect to contracts**
- Verify contract addresses in `.env.local`
- Check network is Base Sepolia (chainId: 84532)
- Clear browser cache and reload

**MetaMask won't connect**
- Install MetaMask extension
- Add Base Sepolia network manually:
  - Network Name: Base Sepolia
  - RPC: https://sepolia.base.org
  - Chain ID: 84532
  - Symbol: ETH
  - Explorer: https://sepolia.basescan.org

**API calls fail**
- Verify API keys in `.env`
- Check rate limits (Locus: 100 req/min, Venice: 60 req/min)
- Review API documentation for required headers

---

## Production Checklist

Before mainnet deployment:

- [ ] All tests pass on testnet
- [ ] Security audit completed (recommend OpenZeppelin or Trail of Bits)
- [ ] Emergency withdrawal function tested
- [ ] Multisig wallet set up for owner functions
- [ ] Frontend load tested
- [ ] API rate limits configured
- [ ] Monitoring and alerting set up
- [ ] Documentation complete
- [ ] Community support channels ready (Discord, Telegram)

---

## Post-Deployment

### Marketing & Growth

1. **Announce launch**
   - Twitter/X thread
   - Discord announcement
   - Product Hunt submission
   - Reddit (r/ethdev, r/base)

2. **Onboard early users**
   - Offer zero fees for first 100 jobs
   - Create tutorial content
   - Host AMA session

3. **Track metrics**
   - Jobs created
   - Total escrow volume
   - User retention
   - Agent registrations

### Next Steps

1. **Security audit** — Budget $10-30K for professional audit
2. **Mobile app** — React Native or Flutter
3. **DAO governance** — Token-based voting
4. **Multi-chain** — Deploy to Arbitrum, Optimism
5. **Enterprise partnerships** — Freelance platforms, DAOs

---

## Support

**Issues:** Open GitHub issue
**Discord:** discord.gg/trustr
**Twitter:** @trustrprotocol
**Email:** hello@trustr.gg

---

**Deployed with ❤️ on Base**
