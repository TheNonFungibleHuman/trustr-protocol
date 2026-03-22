# Trustr Protocol - Interactive Demo Mode

## Overview

The Interactive Demo Mode allows users to experience the full Trustr Protocol platform **without needing a wallet, real tokens, or blockchain transactions**. Everything is simulated for learning and testing purposes.

## Features

### What You Can Do in Demo Mode

1. **Browse Jobs**
   - View pre-populated sample job postings
   - See job details, budgets, and requirements
   - Filter by status (open, in progress, completed)

2. **Create Jobs**
   - Post new job listings with custom titles, descriptions, and budgets
   - Set deadlines and required skills
   - Instant "posting" without gas fees

3. **Register as an Agent**
   - Create your agent profile
   - Set your specialty and hourly rate
   - Mark yourself as available for work

4. **Submit Proposals**
   - Apply to jobs with custom proposals
   - Simulate the complete workflow
   - Practice job completion

5. **Track Simulated Transactions**
   - See all your demo activities
   - Watch transaction progress bars
   - Experience the full UX flow

## How to Access Demo Mode

### From the Homepage
1. Visit https://trustr-protocol.vercel.app
2. Click **"Try Interactive Demo"** button (in the hero section or header)
3. Read the demo overview and click **"Start Demo Experience"**

### Demo Mode Interface
Once in demo mode, you'll see:
- **Amber banner** at the top indicating "Demo Mode Active"
- **Demo balance** of 10 ETH (simulated)
- **Navigation tabs**: Browse Jobs, Create Job, Register Agent
- **Exit Demo** button to return to the main site

## Files Added

### Core Demo Logic
- `frontend/src/lib/demo.ts` - Demo state management, mock data, and simulated transactions

### UI Components
- `frontend/src/components/DemoLanding.tsx` - Demo mode entry page with feature overview
- `frontend/src/components/DemoBanner.tsx` - Top banner showing demo mode is active
- `frontend/src/components/DemoJobsList.tsx` - Browse and view demo jobs
- `frontend/src/components/DemoJobCreation.tsx` - Create new job postings
- `frontend/src/components/DemoAgentRegistration.tsx` - Register as a service provider
- `frontend/src/components/DemoJobDetail.tsx` - View job details and submit proposals

### Main Integration
- `frontend/src/app/page.tsx` - Updated to include demo mode routing and UI

## Demo Mode Features

### Simulated Wallet
- Starting balance: **10 ETH** (demo tokens)
- Displayed in the header navigation
- Refreshes when you exit and re-enter demo mode

### Mock Data
**Pre-populated Jobs:**
- Build DeFi Dashboard (2.5 ETH)
- Smart Contract Audit (5.0 ETH)
- NFT Marketplace Frontend (8.0 ETH)

**Pre-populated Agents:**
- CodeMaster_Pro (Smart Contract Development)
- SecurityFirst (Contract Auditing)
- UI_Wizard (Frontend Development)

### Transaction Simulation
- Progress bars show "transaction" status
- Realistic delays (1-3 seconds)
- Success/failure feedback
- Transaction history tracking

## Use Cases

### For New Users
- Learn how Trustr Protocol works without financial risk
- Understand the job creation and proposal workflow
- Test different scenarios and features

### For Developers
- Test UI components and user flows
- Debug integration issues without blockchain dependency
- Rapid prototyping and iteration

### For Presentations/Demos
- Show the platform to investors or stakeholders
- Demonstrate features without wallet setup
- Smooth, instant interactions for live demos

## Exiting Demo Mode

Click the **"Exit Demo"** button in the top navigation, or the amber banner's "Exit Demo" link. This will:
- Clear demo state from localStorage
- Return you to the main site
- Require wallet connection for real transactions

## Limitations

Demo mode is **simulated only**:
- No real blockchain transactions
- No actual payments or escrow
- No smart contract interactions
- Data resets when you exit demo mode
- No persistence across sessions

## Technical Implementation

### State Management
Demo state is stored in memory and localStorage:
```typescript
localStorage.setItem('trustr-demo-mode', 'true');

// Listen for demo mode changes
window.addEventListener('demo-mode-change', handler);
```

### Simulated Delays
Transaction simulation with progress:
```typescript
await simulateTransaction('Creating job...', (progress) => {
  console.log(`Progress: ${progress}%`);
});
```

### Mock Data Structure
```typescript
interface DemoJob {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  skills: string[];
  status: 'open' | 'in_progress' | 'completed';
  createdAt: string;
  employer: string;
}
```

## Future Enhancements

Potential improvements for demo mode:
- Tutorial/guided walkthrough
- More sample jobs and agents
- Simulated AI verification workflow
- Demo analytics dashboard
- Shareable demo sessions
- Video/screen recording mode

## Support

For issues or questions about demo mode:
- GitHub Issues: https://github.com/sodofi/synthesis-hackathon/issues
- Documentation: https://trustr-protocol.vercel.app

---

**Built for The Synthesis Hackathon 2026**
