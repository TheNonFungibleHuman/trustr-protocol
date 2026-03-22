import axios from 'axios';
import { config } from './config';

/**
 * Venice AI Integration
 * Provides uncensored AI verification, attestation generation, and web-cited validation
 */

export interface VeniceAttestation {
  attestationHash: string;
  verified: boolean;
  confidence: number;
  reasoning: string;
  citations: string[];
  timestamp: number;
}

export interface VerificationResult {
  jobId: number;
  deliverableHash: string;
  approved: boolean;
  confidence: number;
  reasoning: string;
  citations: { url: string; title: string }[];
  checks: {
    name: string;
    passed: boolean;
    details: string;
  }[];
}

export class VeniceClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.partners.venice.apiKey;
    this.baseUrl = config.partners.venice.apiUrl;
  }

  /**
   * Generate attestation for submitted work
   * Uses uncensored AI to verify deliverables
   */
  async generateAttestation(
    jobId: number,
    deliverableHash: string,
    jobDescription: string,
    requirements: string[]
  ): Promise<VeniceAttestation> {
    const response = await axios.post(
      `${this.baseUrl}/v1/attestations/generate`,
      {
        jobId,
        deliverableHash,
        jobDescription,
        requirements,
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
   * Verify work using AI + web citations
   * Checks factual claims against web sources
   */
  async verifyWork(
    deliverableContent: string,
    requirements: string[]
  ): Promise<VerificationResult> {
    const response = await axios.post(
      `${this.baseUrl}/v1/verify`,
      {
        content: deliverableContent,
        requirements,
        includeCitations: true,
        includeWebSearch: true,
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
   * Generate ZK-proof of verification (privacy-preserving)
   * Proves work was verified without revealing details
   */
  async generateZKProof(
    jobId: number,
    verificationResult: VerificationResult
  ): Promise<{ proof: string; publicInputs: string[] }> {
    const response = await axios.post(
      `${this.baseUrl}/v1/zk-proof/generate`,
      {
        jobId,
        verificationResult,
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
   * AI-powered dispute resolution analysis
   * Provides unbiased assessment for disputed jobs
   */
  async analyzeDispute(
    jobDescription: string,
    deliverableContent: string,
    clientComplaint: string,
    providerResponse: string
  ): Promise<{ recommendation: 'client' | 'provider' | 'split'; reasoning: string; confidence: number }> {
    const response = await axios.post(
      `${this.baseUrl}/v1/dispute/analyze`,
      {
        jobDescription,
        deliverable: deliverableContent,
        clientComplaint,
        providerResponse,
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
   * Web search with citations for fact verification
   */
  async verifyClaims(claims: string[]): Promise<{ claim: string; verified: boolean; sources: string[] }[]> {
    const response = await axios.post(
      `${this.baseUrl}/v1/verify-claims`,
      {
        claims,
        includeSources: true,
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
   * Generate quality assessment score
   */
  async assessQuality(
    deliverableContent: string,
    category: 'code' | 'writing' | 'design' | 'research' | 'other'
  ): Promise<{ score: number; maxScore: number; feedback: string; improvements: string[] }> {
    const response = await axios.post(
      `${this.baseUrl}/v1/assess/quality`,
      {
        content: deliverableContent,
        category,
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
}

export const veniceClient = new VeniceClient();
