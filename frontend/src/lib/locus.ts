import axios from 'axios';
import { config } from './config';

/**
 * Locus API Integration
 * Manages AI agent wallets, spending policies, and micropayments
 */

export interface LocusWallet {
  address: string;
  name: string;
  type: 'agent' | 'human';
  policies: SpendingPolicy[];
  balance: {
    amount: string;
    token: string;
  }[];
}

export interface SpendingPolicy {
  id: string;
  type: 'daily_limit' | 'transaction_limit' | 'category_limit' | 'time_based';
  limit: string;
  period?: 'hour' | 'day' | 'week' | 'month';
  category?: string;
  enabled: boolean;
}

export interface LocusAgent {
  id: string;
  name: string;
  wallet: LocusWallet;
  capabilities: string[];
  status: 'active' | 'paused' | 'inactive';
}

export class LocusClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.partners.locus.apiKey;
    this.baseUrl = config.partners.locus.apiUrl;
  }

  /**
   * Create agent wallet
   */
  async createAgentWallet(name: string, ownerAddress: string): Promise<LocusWallet> {
    const response = await axios.post(
      `${this.baseUrl}/v1/wallets/agent`,
      {
        name,
        ownerAddress,
        type: 'agent',
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }

  /**
   * Set spending policy for agent wallet
   */
  async setSpendingPolicy(
    walletAddress: string,
    policy: Omit<SpendingPolicy, 'id' | 'enabled'>
  ): Promise<SpendingPolicy> {
    const response = await axios.post(
      `${this.baseUrl}/v1/wallets/${walletAddress}/policies`,
      policy,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }

  /**
   * Get wallet balance
   */
  async getBalance(walletAddress: string): Promise<{ amount: string; token: string }[]> {
    const response = await axios.get(
      `${this.baseUrl}/v1/wallets/${walletAddress}/balance`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Execute micropayment
   */
  async executeMicropayment(
    fromWallet: string,
    toAddress: string,
    amount: string,
    token: string,
    jobId: number
  ): Promise<{ txHash: string; status: string }> {
    const response = await axios.post(
      `${this.baseUrl}/v1/payments/micro`,
      {
        fromWallet,
        toAddress,
        amount,
        token,
        metadata: {
          jobId,
          protocol: 'trustr',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }

  /**
   * Register agent for escrow
   */
  async registerAgentForEscrow(
    agentId: string,
    escrowContract: string,
    capabilities: string[]
  ): Promise<LocusAgent> {
    const response = await axios.post(
      `${this.baseUrl}/v1/agents/escrow`,
      {
        agentId,
        escrowContract,
        capabilities,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }

  /**
   * Get agent status
   */
  async getAgentStatus(agentId: string): Promise<LocusAgent> {
    const response = await axios.get(
      `${this.baseUrl}/v1/agents/${agentId}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
    return response.data;
  }
}

export const locusClient = new LocusClient();
