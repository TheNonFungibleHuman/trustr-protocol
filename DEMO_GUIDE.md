# Trustr Protocol - Live Demo Guide

## Demo Overview

Trustr Protocol is a decentralized trust and verification platform built on Base Sepolia that connects job posters with verified agents through escrow-backed smart contracts. 

**Key Value Proposition:** Eliminates trust barriers in freelance/agent hiring by holding payments in escrow until work is completed and verified on-chain.

**Target Audience:** Web3 projects hiring contributors, DAOs coordinating work, individuals needing verified services.

**Demo Duration:** 8-12 minutes

---

## Pre-Demo Checklist

### 1. Wallet Setup
- [ ] MetaMask installed in browser
- [ ] Test account created (or use demo account)
- [ ] Base Sepolia network added to MetaMask
  - Network Name: Base Sepolia
  - RPC URL: https://sepolia.base.org
  - Chain ID: 84532
  - Currency Symbol: ETH
  - Block Explorer: https://sepolia.basescan.org

### 2. Test ETH
- [ ] Obtain Base Sepolia ETH from faucet: https://faucet.quicknode.com/base/sepolia
- [ ] Verify balance (recommend 0.1+ ETH for demo)

### 3. Contract Addresses (Saved in Memory)
These are pre-configured in the frontend:
- **Agent Identity Contract:** `0xE9cC05ba1D6ee0190e33c477580CCAf9e318c047`
- **Attestation Registry:** `0x1729F91C8327E1f4C6d740735E8a34e39bd6953b`
- **Escrow Contract:** `0x819Bd6587CeA94d90cCd5c77FfC5014CdA83A947`

### 4. Environment Check
- [ ] Frontend running (`localhost:3000` or deployed URL)
- [ ] Contracts deployed and verified on Base Sepolia
- [ ] Browser console open (F12) for monitoring
- [ ] Slow internet connection backup plan

### 5. Data Prep
- [ ] Prepare demo job data (use examples below)
- [ ] Prepare agent registration data (use examples below)
- [ ] Bookmark relevant transactions in Basescan for quick reference

---

## Step-by-Step Demo Script

### Act 1: Introduction (1-2 minutes)

**Opening Script:**
> "Today I'll show you Trustr Protocol - a decentralized platform that eliminates trust issues when hiring freelancers or agents. Instead of hoping someone delivers, we use smart contract escrow to guarantee payment only happens when work is verified."

 **Visuals:**
- Open `localhost:3000`
- Show homepage with hero section
- Point out "Trustless. Verifiable. On-Chain."

**Key Talking Points:**
- No intermediaries taking 20% fees
- Funds held in escrow, not by a person
- Verification happens on-chain
- Built on Base Sepolia (low gas fees)

---

### Act 2: Wallet Connection (1 minute)

**Action:** Click "Connect MetaMask"

**Narration:**
> "First, let's connect your Web3 wallet. This is your identity on Trustr Protocol - no email, no password, just your wallet address."

**What User Sees:**
1. MetaMask popup appears
2. Click "Connect"
3. Homepage updates showing wallet address
4. "Create Job" and "Register Agent" buttons become active

**Pro Tip:**
> "Notice we never ask for private keys or seed phrases. Your wallet is your identity - this is standard Web3 UX."

---

### Act 3: Creating a Job (3-4 minutes)

**Action:** Click "Create Job" button

**Fill Demo Job:**
```
Job Title: Smart Contract Audit
Description: Need a security audit of our ERC20 token contract. Must check for reentrancy, overflow, and standard ERC20 compliance.
Payment (ETH): 0.05
Tags: security, audit, solidity
Verification Type: Manual (I'll review the work myself)
```

**Narration:**
> "Let's create a job. I'm looking for someone to audit our smart contract. I'll set the payment to 0.05 ETH, and the payment type to 'Escrow'."

**Key Moments:**
1. Fill out form (show all fields)
2. Select payment type dropdown - explain options:
   - **Escrow:** Funds held until you mark complete
   - **Direct:** Immediate payment (risky, not recommended)
   - **Milestone:** Split payment across deliverables
3. Click "Create Job"
4. MetaMask popup: "Confirm Transaction"
5. Point out the 0.05 ETH being sent to escrow contract

**After Transaction:**
> "Transaction confirmed! The 0.05 ETH is now locked in the escrow contract, not with us, not with the freelancer. Let me show you..."

**Visual Proof:**
- Click transaction hash to open Basescan
- Show ETH transfer to escrow contract address
- 
> "This is the magic of smart contracts - I can't run away with the funds, and the freelancer doesn't have to worry about not getting paid."

---

### Act 4: Viewing Jobs (2 minutes)



### Browse Jobs Tab

**Action:** Click "Browse Jobs" tab

**Narration:**
> "Here's the public job board. Anyone can see open opportunities. Notice each card shows:"
- Status badge (Open/In Progress/Complete)
- Payment amount
- Verification type
- "View Details" button (future feature)

**Highlight:**
- Point out your newly created job in the list
- Show loading state if refreshing

---

### My Jobs Tab

**Action:** Click "My Jobs" tab

**Narration:**
> "Switch to 'My Jobs' - this filters to show only jobs I posted. This uses your wallet address to query the blockchain. Currently you'll see the job we just created."

**What User Sees:**
- Job card with "Open" status
- 0.05 ETH payment
- Escrow verification type

**Future Demo Point (if time allows):**
> "In production, clicking this job would show application management, work submission, and the release workflow."

---

### Act 5: Agent Registration (2 minutes)

**Action:** Click "Register Agent" button

**Fill Demo Agent Data:**
```
Agent Name: Alex Chen
Role: Smart Contract Security Auditor
Bio: 5 years auditing DeFi protocols. Found 12 critical vulnerabilities in production contracts. Specialized in ERC20, ERC721, and staking contracts.
Skills: Solidity, Formal Verification, Mythril, Slither
Hourly Rate (ETH): 0.01
```

**Narration:**
> "Now let's register as an agent. This is how freelancers make themselves discoverable. The key differentiator - we can verify past work through attestations."

**Key Moments:**
1. Fill out form (show all fields)
2. Explain "Attestations" section:
   - Future feature: Show verified work history
   - Other users can vouch for completed jobs
   - Builds on-chain reputation
3. Click "Register Agent"
4. MetaMask transaction confirmation

**After Transaction:**
> "You're now a registered agent! In production, job posters could see your history, verified work, and reputation score - all on-chain and impossible to fake."

---

### Act 6: Closing Summary (1-2 minutes)

**Visuals:** Return to homepage

**Closing Script:**
> "Let's recap what makes Trustr Protocol different:

1. **No Trust Required:** Escrow holds funds, not a person or company
2. **Transparent:** All transactions visible on-chain
3. **Low Fees:** Just gas costs, no 20% platform fees
4. **Portable Reputation:** Your work history is on-chain, not locked to a platform
5. **Global:** Anyone with internet and a wallet can participate

**The Problem We Solve:**
- Freelancers worry about not getting paid
- Employers worry about work not being delivered
- Platforms take 15-20% fees to "guarantee" work

**Our Solution:**
- Smart contracts enforce agreements
- Escrow guarantees payment
- Attestations build verifiable reputation

**Next Steps:**
- Join our Discord: [link]
- Contribute on GitHub: github.com/hanifolayiwola/trustr-protocol
- Apply for The Synthesis Hackathon"

---

## Troubleshooting Section

### Common Issues

**1. MetaMask Won't Connect**
- **Symptom:** Click connect, nothing happens or error
- **Fix:** Refresh page, ensure MetaMask extension is unlocked
- **Backup:** Use a different browser with MetaMask installed

**2. "Wrong Network" Error**
- **Symptom:** MetaMask shows Ethereum Mainnet, not Base Sepolia
- **Fix:** Manually switch to Base Sepolia in MetaMask network dropdown
- **Prevent:** Pre-switch network before demo

**3. Transaction Fails**
- **Symptom:** MetaMask shows error or "Out of Gas"
- **Fix:** Check you have enough ETH (0.1+ recommended)
- **Fix:** Increase gas limit in MetaMask advanced settings
- **Backup:** Have a pre-created job transaction ready to show

**4. Page Shows Loading Forever**
- **Symptom:** Jobs/agents don't load, infinite spinner
- **Fix:** Check browser console for errors
- **Fix:** Verify contract addresses are correct
- **Fix:** Ensure Base Sepolia RPC is accessible
- **Workaround:** Show screenshots as backup

**5. MetaMask Doesn't Pop Up**
- **Symptom:** Click transaction button, no popup
- **Fix:** Check MetaMask notification icon in browser toolbar
- **Fix:** Unlock MetaMask manually
- **Prevent:** Keep MetaMask unlocked during demo

**6. Frontend Won't Build/Run**
- **Symptom:** `npm run dev` fails
- **Fix:** `rm -rf node_modules && npm install`
- **Fix:** Check Node.js version (18+)
- **Backup:** Have deployed version ready

---

## Demo Tips

### Before the Demo

1. **Do a Full Rehearsal** - Time yourself, hit every talking point
2. **Pre-fund Wallet** - Get 0.1+ ETH, don't risk faucet delays
3. **Open Browser DevTools** - F12, keep Console tab visible for debugging
4. **Bookmark Transactions** - Have Basescan links ready
5. **Slow Internet Backup** - Record screen video as fallback
6. **Close Unnecessary Tabs** - Reduce browser lag
7. **Turn Off Notifications** - Prevent distractions

### During the Demo

1. **Speak Slowly** - Nerves make you talk fast, consciously slow down
2. **Pause for Questions** - Leave natural breaks between acts
3. **Zoom Your Browser** - Cmd/Ctrl + for better visibility
4. **Narrate Everything** - Explain what you're doing as you do it
5. **Highlight the Magic** - Emphasize when ETH goes to escrow
6. **Use the Console** - Show contract interactions happening
7. **Have Screenshots Ready** - In case transaction fails

### Key Differentiators to Emphasize

- **Upwork/Fiverr:** 20% fees, centralized control, can ban accounts
- **Trustr Protocol:** 0% fees (just gas), decentralized, censorship-resistant
- **Traditional Escrow:** Manual, slow, expensive, requires trust in escrow agent
- **Crypto Escrow:** Automated, instant, cheap, trustless

 ---

## Q&A Preparation

### Likely Questions

 **Q: What if the freelancer does bad work?**
> "Great question. Currently the job poster marks jobs complete manually. In v2, we'll add dispute resolution where attested agents can vote on whether work meets requirements. The escrow contract would release based on majority vote."

**Q: How do you make money?**
> "We don't take fees. The protocol is free to use - you only pay gas. Future monetization could include premium features like featured job listings, verified badge subscriptions, or enterprise API access."

**Q: What's the difference between Escrow and Direct payment?**
> "Escrow holds funds until the job poster marks work complete. Direct pays immediately - use only if you 100% trust the agent. We recommend Escrow for all first-time collaborations."

**Q: Can I get my money back if I use Escrow?**
> "Yes! The job poster can cancel and refund at any time before marking the job complete. Once marked complete, funds release to the agent. Future version will add dispute windows."

**Q: Why Base Sepolia and not Ethereum mainnet?**
> "Gas fees. On mainnet, a transaction could cost $10-50. On Base Sepolia, it's pennies. Plus we're in a hackathon - mainnet deployment comes after we win!"

**Q: How is this different from existing freelance platforms?**
> "Three ways: 1) No 20% fees, 2) Your reputation is on-chain and portable, not locked to a platform, 3) Censorship-resistant - no one can deplatform you."

**Q: What prevents someone from creating fake reviews?**
> "Attestations are tied to completed jobs on-chain. You can only vouch for work you actually contracted and verified. Future version adds social graph analysis to detect review rings."

**Q: Is this production-ready?**
> "For the hackathon, it's an MVP. Production would add: dispute resolution, multi-sig escrow for large jobs, fiat on-ramps, mobile app, and enhanced attestation tracking."

**Q: Can I use this for non-crypto work?**
> "Absolutely. You can post any job - writing, design, consulting. Payment happens in crypto, but the work itself can be anything."

**Q: What happens if I lose access to my wallet?**
> "Unfortunately, funds in active escrows would be inaccessible. This is why we recommend using a hardware wallet and backing up your seed phrase. Future version could add account recovery options."

### Hard Questions (Have Answers Ready)

**Q: This seems like it could be used for illegal work.**
> "Same could be said of cash, email, or any communication tool. We're building legal, legitimate freelance infrastructure. Law enforcement can still trace on-chain transactions."

**Q: What's your moat? What prevents copying?**
> "First-mover advantage in Web3 freelance, network effects of reputation system, and the fact that reputation is non-transferable. You can copy the code, but not the user graph."

**Q: How do you handle chargebacks or fraud?**
> "Crypto transactions are irreversible - that's intentional. The escrow system protects both parties before funds move. After release, it's final. This is why verification matters."

---

## Post-Demo Checklist

- [ ] Thank audience and invite questions
- [ ] Share GitHub repo link
- [ ] Share Discord/Telegram community links
- [ ] Collect feedback (what was clear, what was confusing)
- [ ] Note any bugs or UX issues discovered
- [ ] Follow up with interested participants

---

## Appendix: Quick Reference

### Contract Addresses
```
Agent Identity:   0xE9cC05ba1D6ee0190e33c477580CCAf9e318c047
Attestation Reg:  0x1729F91C8327E1f4C6d740735E8a34e39bd6953b
Escrow:           0x819Bd6587CeA94d90cCd5c77FfC5014CdA83A947
```

### Demo Wallet Address
```
Demo Account: [YOUR_WALLET_ADDRESS]
Base Sepolia Faucet: https://faucet.quicknode.com/base/sepolia
```

### Key URLs
```
Frontend: localhost:3000
Basescan: https://sepolia.basescan.org
GitHub: github.com/hanifolayiwola/trustr-protocol
```

### Transaction Examples (Update After Demo)
```
First Job Creation TX: [TX_HASH]
Agent Registration TX: [TX_HASH]
```

---

**Good luck with your demo! Remember: speak slowly, show the escrow magic, and emphasize zero fees.**
