import { ethers } from 'ethers';
import { config } from './config';

// Escrow Contract ABI (minimal - add full ABI after compilation)
export const ESCROW_ABI = [
  'event JobCreated(uint256 indexed jobId, address indexed client, address indexed provider, uint256 paymentAmount, address paymentToken)',
  'event JobSubmitted(uint256 indexed jobId, address indexed provider, string deliverableHash)',
  'event JobVerified(uint256 indexed jobId, address indexed verifier, bool approved)',
  'event PaymentReleased(uint256 indexed jobId, address indexed provider, uint256 amount)',
  'event DisputeOpened(uint256 indexed jobId, address indexed opener, string reason)',
  'event DisputeResolved(uint256 indexed jobId, address resolver, bool refundedToClient)',
  'function createJob(address provider, string description, uint256 paymentAmount, address paymentToken, uint256 deadline, uint8 verificationType, string metadata) external payable returns (uint256)',
  'function submitWork(uint256 jobId, string deliverableHash, string attestation) external',
  'function verifyWork(uint256 jobId, bool approved, string reason) external',
  'function releasePayment(uint256 jobId) external',
  'function openDispute(uint256 jobId, string reason) external',
  'function resolveDispute(uint256 jobId, bool refundToClient) external',
  'function cancelJob(uint256 jobId) external',
  'function getJob(uint256 jobId) external view returns (tuple(uint256 id, address client, address provider, string description, string deliverableHash, uint256 paymentAmount, address paymentToken, uint8 status, uint8 verificationType, uint256 createdAt, uint256 deadlineAt, string metadata))',
  'function getJobStatus(uint256 jobId) external view returns (uint8)',
  'function getUserJobs(address user) external view returns (uint256[])',
  'function approvedVerifiers(address) external view returns (bool)',
];

// Agent Identity Contract ABI
export const AGENT_IDENTITY_ABI = [
  'event AgentRegistered(address indexed walletAddress, string name, string creatorAddress)',
  'event AgentVerified(address indexed walletAddress, bool verified)',
  'function registerAgent(address walletAddress, string name, string description, string creatorAddress, string[] capabilities, string metadataUri) external',
  'function getAgent(address walletAddress) external view returns (tuple(address walletAddress, string name, string description, string creatorAddress, string[] capabilities, string metadataUri, bool verified, uint256 registeredAt, uint256 reputationScore))',
  'function isRegisteredAgent(address) external view returns (bool)',
  'function getAllAgents() external view returns (address[])',
];

// Attestation Registry Contract ABI
export const ATTESTATION_REGISTRY_ABI = [
  'event AttestationCreated(uint256 indexed attestationId, uint256 indexed jobId, address indexed provider, address verifier)',
  'function createAttestation(uint256 jobId, address escrowContract, address provider, string attestatonHash, bytes signature) external returns (uint256)',
  'function getAttestation(uint256 attestationId) external view returns (tuple(uint256 id, uint256 jobId, address escrowContract, address provider, address verifier, string attestatonHash, bool verified, uint256 timestamp, bytes signature))',
  'function getProviderAttestations(address provider) external view returns (uint256[])',
  'function getReputation(address provider) external view returns (tuple(uint256 completedJobs, uint256 successfulAttestations, uint256 failedAttestations, uint256 reputationScore))',
];

export function getProvider(): ethers.BrowserProvider | null {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    return null;
  }
  return new ethers.BrowserProvider((window as any).ethereum);
}

export function getContract(address: string, abi: any[], signer?: ethers.Signer) {
  const provider = getProvider();
  if (!provider) return null;
  
  if (signer) {
    return new ethers.Contract(address, abi, signer);
  }
  
  return new ethers.Contract(address, abi, provider);
}

export function getEscrowContract(signer?: ethers.Signer) {
  return getContract(config.contracts.escrow, ESCROW_ABI, signer);
}

export function getAgentIdentityContract(signer?: ethers.Signer) {
  return getContract(config.contracts.agentIdentity, AGENT_IDENTITY_ABI, signer);
}

export function getAttestationRegistryContract(signer?: ethers.Signer) {
  return getContract(config.contracts.attestationRegistry, ATTESTATION_REGISTRY_ABI, signer);
}
