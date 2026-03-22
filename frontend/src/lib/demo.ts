// Demo Mode - Simulated Workflow for Trustr Protocol
// Allows users to experience the platform without real wallets or tokens

export interface DemoJob {
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

export interface DemoAgent {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  completedJobs: number;
  isAvailable: boolean;
}

export interface DemoTransaction {
  id: string;
  type: 'job_created' | 'agent_registered' | 'proposal_submitted' | 'job_completed';
  description: string;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed';
}

// Mock data for demo mode
export const INITIAL_DEMO_JOBS: DemoJob[] = [
  {
    id: 'demo-job-1',
    title: 'Build DeFi Dashboard',
    description: 'Create a responsive dashboard for tracking DeFi portfolios with real-time price updates and analytics.',
    budget: '2.5 ETH',
    deadline: '2026-04-15',
    skills: ['React', 'Web3', 'TypeScript', 'DeFi'],
    status: 'open',
    createdAt: '2026-03-22T10:00:00Z',
    employer: 'DemoUser_Alpha'
  },
  {
    id: 'demo-job-2',
    title: 'Smart Contract Audit',
    description: 'Audit ERC-20 token contract for security vulnerabilities and gas optimization.',
    budget: '5.0 ETH',
    deadline: '2026-04-01',
    skills: ['Solidity', 'Security', 'Smart Contracts'],
    status: 'in_progress',
    createdAt: '2026-03-21T14:30:00Z',
    employer: 'DemoUser_Beta'
  },
  {
    id: 'demo-job-3',
    title: 'NFT Marketplace Frontend',
    description: 'Build a modern NFT marketplace UI with minting, bidding, and collection features.',
    budget: '8.0 ETH',
    deadline: '2026-05-01',
    skills: ['Next.js', 'Tailwind', 'Web3', 'NFTs'],
    status: 'open',
    createdAt: '2026-03-20T09:15:00Z',
    employer: 'DemoUser_Gamma'
  }
];

export const INITIAL_DEMO_AGENTS: DemoAgent[] = [
  {
    id: 'demo-agent-1',
    name: 'CodeMaster_Pro',
    specialty: 'Smart Contract Development',
    rating: 4.9,
    completedJobs: 47,
    isAvailable: true
  },
  {
    id: 'demo-agent-2',
    name: 'SecurityFirst',
    specialty: 'Contract Auditing',
    rating: 5.0,
    completedJobs: 89,
    isAvailable: true
  },
  {
    id: 'demo-agent-3',
    name: 'UI_Wizard',
    specialty: 'Frontend Development',
    rating: 4.8,
    completedJobs: 124,
    isAvailable: false
  }
];

// Simulated network delays (ms)
const DELAYS = {
  jobCreation: 2000,
  agentRegistration: 1500,
  proposalSubmission: 1000,
  jobCompletion: 2500
};

// Demo state management
let demoJobs: DemoJob[] = [...INITIAL_DEMO_JOBS];
let demoAgents: DemoAgent[] = [...INITIAL_DEMO_AGENTS];
let demoTransactions: DemoTransaction[] = [];
let demoWalletBalance = '10.0'; // Starting demo balance

export const demoMode = {
  // Check if demo mode is active
  isActive: () => {
    return typeof window !== 'undefined' && 
           localStorage.getItem('trustr-demo-mode') === 'true';
  },

  // Enable/disable demo mode
  setMode: (enabled: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('trustr-demo-mode', enabled.toString());
      window.dispatchEvent(new CustomEvent('demo-mode-change', { detail: enabled }));
    }
  },

  // Get current demo wallet balance
  getBalance: () => demoWalletBalance,

  // Simulate job creation
  createJob: async (jobData: Omit<DemoJob, 'id' | 'createdAt' | 'status' | 'employer'>): Promise<DemoJob> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, DELAYS.jobCreation));

    const newJob: DemoJob = {
      ...jobData,
      id: `demo-job-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'open',
      employer: 'DemoUser_You'
    };

    demoJobs = [newJob, ...demoJobs];
    
    // Record transaction
    demoTransactions.unshift({
      id: `tx-${Date.now()}`,
      type: 'job_created',
      description: `Created job: ${jobData.title}`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    });

    return newJob;
  },

  // Get all demo jobs
  getJobs: (): DemoJob[] => [...demoJobs],

  // Get job by ID
  getJobById: (id: string): DemoJob | undefined => {
    return demoJobs.find(job => job.id === id);
  },

  // Simulate agent registration
  registerAgent: async (agentData: Omit<DemoAgent, 'id' | 'completedJobs' | 'rating'>): Promise<DemoAgent> => {
    await new Promise(resolve => setTimeout(resolve, DELAYS.agentRegistration));

    const newAgent: DemoAgent = {
      ...agentData,
      id: `demo-agent-${Date.now()}`,
      rating: 5.0, // New agents start with perfect rating
      completedJobs: 0
    };

    demoAgents = [newAgent, ...demoAgents];

    demoTransactions.unshift({
      id: `tx-${Date.now()}`,
      type: 'agent_registered',
      description: `Registered as agent: ${agentData.name}`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    });

    return newAgent;
  },

  // Get all demo agents
  getAgents: (): DemoAgent[] => [...demoAgents],

  // Get available agents
  getAvailableAgents: (): DemoAgent[] => {
    return demoAgents.filter(agent => agent.isAvailable);
  },

  // Simulate proposal submission
  submitProposal: async (jobId: string, agentId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, DELAYS.proposalSubmission));

    demoTransactions.unshift({
      id: `tx-${Date.now()}`,
      type: 'proposal_submitted',
      description: `Proposal submitted for job ${jobId}`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    });

    return true;
  },

  // Simulate job completion
  completeJob: async (jobId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, DELAYS.jobCompletion));

    const job = demoJobs.find(j => j.id === jobId);
    if (job) {
      job.status = 'completed';
    }

    demoTransactions.unshift({
      id: `tx-${Date.now()}`,
      type: 'job_completed',
      description: `Job completed: ${job?.title}`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    });
  },

  // Get recent transactions
  getTransactions: (): DemoTransaction[] => [...demoTransactions],

  // Reset demo state to initial values
  reset: () => {
    demoJobs = [...INITIAL_DEMO_JOBS];
    demoAgents = [...INITIAL_DEMO_AGENTS];
    demoTransactions = [];
    demoWalletBalance = '10.0';
  }
};

// Helper to format demo addresses
export const formatDemoAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Generate a random demo address
export const generateDemoAddress = () => {
  const chars = '0123456789ABCDEF';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
};

// Simulate transaction confirmation
export const simulateTransaction = async (
  description: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; txHash?: string }> => {
  const stages = [10, 30, 60, 80, 100];
  
  for (const progress of stages) {
    await new Promise(resolve => setTimeout(resolve, 400));
    onProgress?.(progress);
  }

  const txHash = '0x' + Array(64).fill(0).map(() => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');

  return { success: true, txHash };
};

export default demoMode;

