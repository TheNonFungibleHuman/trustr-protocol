// Trustr Protocol Configuration
export const config = {
  // Chain Configuration
  chains: {
    base: {
      id: 8453,
      name: 'Base',
      rpcUrl: 'https://mainnet.base.org',
      blockExplorer: 'https://basescan.org',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
    },
    baseSepolia: {
      id: 84532,
      name: 'Base Sepolia',
      rpcUrl: 'https://sepolia.base.org',
      blockExplorer: 'https://sepolia.basescan.org',
      nativeCurrency: {
        name: 'Sepolia Ether',
        symbol: 'ETH',
        decimals: 18,
      },
    },
  },

  // Contract Addresses (update after deployment)
  contracts: {
    escrow: process.env.NEXT_PUBLIC_ESCROW_ADDRESS || '0x819Bd6587CeA94d90cCd5c77FfC5014CdA83A947',
    attestationRegistry: process.env.NEXT_PUBLIC_ATTESTATION_ADDRESS || '0x1729F91C8327E1f4C6d740735E8a34e39bd6953b',
    agentIdentity: process.env.NEXT_PUBLIC_AGENT_IDENTITY_ADDRESS || '0xE9cC05ba1D6ee0190e33c477580CCAf9e318c047',
  },

  // Partner API Configuration
  partners: {
    locus: {
      apiKey: process.env.NEXT_PUBLIC_LOCUS_API_KEY || '',
      apiUrl: process.env.NEXT_PUBLIC_LOCUS_API_URL || 'https://api.locus.chat',
    },
    venice: {
      apiKey: process.env.NEXT_PUBLIC_VENICE_API_KEY || '',
      apiUrl: process.env.NEXT_PUBLIC_VENICE_API_URL || 'https://api.venice.ai',
    },
    uniswap: {
      routerAddress: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD', // Base mainnet router
    },
  },

  // Tokens (Base network)
  tokens: {
    ETH: {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      name: 'Ether',
      decimals: 18,
    },
    USDC: {
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    },
    DAI: {
      address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    },
  },

  // Platform Settings
  platformFeeBps: 50, // 0.5%
  maxDisputeDays: 7,
};

export type VerificationType = 'Manual' | 'AI' | 'Hybrid';

export type JobStatus = 
  | 'Created' 
  | 'InProgress' 
  | 'Submitted' 
  | 'Verified' 
  | 'Disputed' 
  | 'Completed' 
  | 'Cancelled' 
  | 'Refunded';

export interface Job {
  id: number;
  client: string;
  provider: string;
  description: string;
  deliverableHash: string;
  paymentAmount: bigint;
  paymentToken: string;
  status: JobStatus;
  verificationType: VerificationType;
  createdAt: number;
  deadlineAt: number;
  metadata: string;
}

export interface Attestation {
  jobId: number;
  verifier: string;
  approved: boolean;
  reason: string;
  timestamp: number;
  signature: string;
}
