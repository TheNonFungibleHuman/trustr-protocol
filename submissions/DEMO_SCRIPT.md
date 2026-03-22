# Trustr Protocol — Demo Script 🎬

## 3-Minute Pitch Video Script

### Scene 1: Hook (0:00 - 0:20)

**Visual:** Split screen showing frustrated freelancer on left, happy freelancer on right

**Narration:**
> "Meet Sarah. Last month, she delivered a $5,000 website design. The client ghosted her. No payment. No recourse.
> 
> This is Trustr. Sarah now uses our protocol. She gets paid — guaranteed."

**On-screen text:** "$52B lost to freelance payment fraud annually"

---

### Scene 2: Problem (0:20 - 0:40)

**Visual:** Animation showing traditional escrow flow with high fees

**Narration:**
> "Traditional escrow charges 5-10% fees. That's $500 on a $5,000 job. Slow. Expensive. Broken.
> 
> And when AI agents provide services? There's no infrastructure at all."

**On-screen text:** "5-10% fees | 3-5 day settlement | No agent support"

---

### Scene 3: Solution (0:40 - 1:10)

**Visual:** Trustr platform demo — clean UI showing job creation

**Narration:**
> "Trustr is trustless escrow for humans and AI agents.
> 
> Here's how it works:
> 1. Client creates job, funds escrow with any token — ETH, USDC, DAI
> 2. Provider delivers work, submits proof
> 3. Venice AI verifies quality with web citations
> 4. Payment releases instantly — 0.5% fee
> 
> That's 10x cheaper than alternatives."

**On-screen text:** "0.5% fee | Instant settlement | AI verification"

---

### Scene 4: AI Agent Integration (1:10 - 1:40)

**Visual:** Show agent registration, Locus wallet creation, policy setup

**Narration:**
> "This is where Trustr gets revolutionary.
> 
> AI agents can register as service providers. They get a Locus wallet with spending policies. When they complete work, they get paid automatically.
> 
> Need a code review? An AI verifier checks it. Need content written? Venice AI validates quality. All on-chain. All trustless."

**On-screen text:** "ERC-8004 agents | Locus wallets | Policy-governed spending"

---

### Scene 5: Partner Integration (1:40 - 2:10)

**Visual:** Architecture diagram with 5 partner logos

**Narration:**
> "Built on Base for sub-penny gas fees.
> Integrated with MetaMask SDK for Smart Accounts and policy wallets.
> Locus powers agent payment infrastructure.
> Uniswap auto-swaps any token to USDC for stable escrow.
> Venice AI provides uncensored, citation-backed verification.
> 
> Five partners. One coherent protocol."

**On-screen text:** "Base • MetaMask • Locus • Uniswap • Venice AI"

---

### Scene 6: Live Demo (2:10 - 2:40)

**Visual:** Screen recording of actual platform usage

**Narration:**
> "Let me show you Trustr in action.
> 
> [Connect wallet]
> Wallet connected via MetaMask SDK.
> 
> [Create job]
> Creating a job: 'Build React component' for 0.1 ETH.
> Selecting AI verification.
> 
> [Submit work]
> Provider submits deliverable hash.
> Venice AI is analyzing the work now...
> 
> [Verification]
> AI approves with 95% confidence.
> Payment released — 0.0995 ETH to provider, 0.0005 ETH fee to protocol.
> 
> Done. In 15 seconds. For less than a penny in gas."

---

### Scene 7: Market & Vision (2:40 - 2:55)

**Visual:** Market size numbers, roadmap timeline

**Narration:**
> "The freelance market is $455 billion today, growing to $1.2 trillion by 2030.
> AI agent services will be $47 billion.
> Trustr captures value from both.
> 
> We're not just building a product. We're building the payment layer for the agent economy."

**On-screen text:** "$1.2T TAM | 1.5B freelancers | 10K+ AI agents by 2027"

---

### Scene 8: Close & Call to Action (2:55 - 3:00)

**Visual:** Trustr logo, website URL, hackathon tracks

**Narration:**
> "Trustr. Trust, but verify. Get paid, guaranteed.
> 
> Built for the Synthesis Hackathon. Submitted to 7 tracks.
> 
> Visit trustr.gg to try the demo."

**On-screen text:** "trustr.gg | @trustrprotocol | #SynthesisHackathon"

---

## 1-Minute Elevator Pitch (Short Version)

**Hook:**
> "Freelancers lose $52 billion yearly to payment fraud. Trustr fixes this."

**Solution:**
> "We're trustless escrow for humans and AI agents. Clients fund escrow, providers deliver work, AI verifies quality, payment releases instantly. 0.5% fee — 10x cheaper than alternatives."

**Differentiation:**
> "First protocol built for the AI agent economy. Integrated with Base, MetaMask, Locus, Uniswap, and Venice AI."

**Ask:**
> "Try the demo at trustr.gg. Vote for us in 7 hackathon tracks."

---

## Technical Demo Walkthrough (5-Minute Version)

### Part 1: Setup (0:00 - 1:00)

1. Open terminal: `cd trustr-protocol`
2. Show contract structure:
   ```bash
   ls contracts/
   # Escrow.sol, AttestationRegistry.sol, AgentIdentity.sol
   ```
3. Show deployed contracts:
   ```bash
   cat deployments/baseSepolia.json
   ```

### Part 2: Smart Contract Demo (1:00 - 2:30)

4. Connect to Base Sepolia:
   ```bash
   npx hardhat console --network baseSepolia
   ```
5. Create test job:
   ```javascript
   const escrow = await ethers.getContractAt("Escrow", ESCROW_ADDRESS);
   const tx = await escrow.createJob(
     providerAddress,
     "Test job",
     ethers.parseEther("0.01"),
     ETH_ADDRESS,
     deadline,
     1, // AI verification
     ""
   );
   await tx.wait();
   console.log("Job created!");
   ```

### Part 3: Frontend Demo (2:30 - 4:00)

6. Open browser: `http://localhost:3000`
7. Connect MetaMask wallet
8. Create job via UI
9. Show job appearing in "My Jobs"
10. Demonstrate agent registration

### Part 4: Partner Integration (4:00 - 5:00)

11. Show Locus API integration:
    ```javascript
    const wallet = await locusClient.createAgentWallet("Agent1", owner);
    ```
12. Show Venice verification:
    ```javascript
    const result = await veniceClient.verifyWork(content, requirements);
    console.log(result.confidence); // 0.95
    ```
13. Show Uniswap auto-swap logic in code

---

## Q&A Preparation

### Anticipated Questions

**Q: How is this different from existing escrow contracts?**
> A: Three key differences: (1) Native AI agent support with Locus integration, (2) AI-powered verification via Venice, (3) 0.5% fees vs 5-10% industry standard. We're built for the agent economy from day one.

**Q: What if the AI verifier makes a mistake?**
> A: We offer three verification modes: AI-only, Manual-only, and Hybrid. For high-value jobs, clients can require human arbitration. Venice AI also provides confidence scores and web citations for transparency.

**Q: How do you prevent Sybil attacks on reputation?**
> A: On-chain attestations are tied to specific job completions. Creating fake jobs costs gas and escrow fees. Plus, our reputation algorithm weights long-term history over recent activity.

**Q: Why Base and not another L2?**
> A: Base has the lowest fees (<$0.01/tx), instant finality, Coinbase integration, and is actively building the agent economy ecosystem. Perfect fit for our use case.

**Q: What's your go-to-market strategy?**
> A: Start with crypto-native freelancers (developers, designers), then expand to AI agent frameworks (LangChain, AutoGPT), then traditional freelance platforms via API integration.

---

## Submission Checklist

### Required Deliverables

- ✅ Working smart contracts deployed to Base
- ✅ Functional frontend UI
- ✅ All 5 partner integrations
- ✅ Demo video (3 minutes)
- ✅ Pitch deck (13 slides)
- ✅ GitHub repository with README
- ✅ Live demo URL

### Track-Specific Requirements

See `TRACK_CHECKLISTS.md` for detailed requirements per track.

---

**Recording Tips:**
- Use Loom or OBS for screen recording
- Clear audio (use external mic if possible)
- Good lighting for face cam
- Edit with captions for accessibility
- Upload to YouTube (unlisted) or Loom
