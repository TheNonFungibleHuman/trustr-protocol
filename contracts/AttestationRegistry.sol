// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Trustr Attestation Registry
 * @dev Stores and manages attestations for completed work
 * Enables reputation tracking for both human and AI agents
 */
contract AttestationRegistry is ReentrancyGuard, Ownable {
    struct AttestationRecord {
        uint256 id;
        uint256 jobId;
        address escrowContract;
        address provider;
        address verifier;
        string attestatonHash; // IPFS hash of attestation details
        bool verified;
        uint256 timestamp;
        bytes signature;
    }
    
    struct Reputation {
        uint256 completedJobs;
        uint256 successfulAttestations;
        uint256 failedAttestations;
        uint256 reputationScore; // 0-1000
    }
    
    uint256 private _attestationCounter;
    mapping(uint256 => AttestationRecord) private _attestations;
    mapping(address => uint256[]) private _providerAttestations;
    mapping(address => Reputation) public reputations;
    mapping(address => bool) public approvedVerifiers;
    mapping(bytes32 => bool) private _processedSignatures;
    
    event AttestationCreated(
        uint256 indexed attestationId,
        uint256 indexed jobId,
        address indexed provider,
        address verifier
    );
    
    event AttestationVerified(
        uint256 indexed attestationId,
        bool verified
    );
    
    event ReputationUpdated(
        address indexed provider,
        uint256 newScore
    );
    
    constructor() Ownable(msg.sender) {}
    
    modifier onlyApprovedVerifier() {
        require(approvedVerifiers[msg.sender], "Not approved verifier");
        _;
    }
    
    /**
     * @dev Create attestation record for completed job
     * @param jobId Job ID from escrow contract
     * @param escrowContract Escrow contract address
     * @param provider Service provider address
     * @param attestatonHash IPFS hash of attestation data
     * @param signature Cryptographic signature
     */
    function createAttestation(
        uint256 jobId,
        address escrowContract,
        address provider,
        string calldata attestatonHash,
        bytes calldata signature
    ) external onlyApprovedVerifier returns (uint256) {
        require(escrowContract != address(0), "Invalid escrow");
        require(provider != address(0), "Invalid provider");
        require(bytes(attestatonHash).length > 0, "Hash required");
        
        bytes32 sigHash = keccak256(signature);
        require(!_processedSignatures[sigHash], "Signature already used");
        _processedSignatures[sigHash] = true;
        
        _attestationCounter++;
        uint256 attestationId = _attestationCounter;
        
        _attestations[attestationId] = AttestationRecord({
            id: attestationId,
            jobId: jobId,
            escrowContract: escrowContract,
            provider: provider,
            verifier: msg.sender,
            attestatonHash: attestatonHash,
            verified: false,
            timestamp: block.timestamp,
            signature: signature
        });
        
        _providerAttestations[provider].push(attestationId);
        
        emit AttestationCreated(attestationId, jobId, provider, msg.sender);
        
        return attestationId;
    }
    
    /**
     * @dev Verify an attestation
     */
    function verifyAttestation(uint256 attestationId, bool verified) external onlyOwner {
        AttestationRecord storage record = _attestations[attestationId];
        require(record.id != 0, "Attestation not found");
        require(!record.verified, "Already verified");
        
        record.verified = verified;
        
        if (verified) {
            Reputation storage rep = reputations[record.provider];
            rep.successfulAttestations++;
            rep.completedJobs++;
            rep.reputationScore = calculateReputationScore(
                rep.completedJobs,
                rep.successfulAttestations,
                rep.failedAttestations
            );
        } else {
            Reputation storage rep = reputations[record.provider];
            rep.failedAttestations++;
            rep.reputationScore = calculateReputationScore(
                rep.completedJobs,
                rep.successfulAttestations,
                rep.failedAttestations
            );
        }
        
        emit AttestationVerified(attestationId, verified);
        emit ReputationUpdated(record.provider, reputations[record.provider].reputationScore);
    }
    
    /**
     * @dev Calculate reputation score (0-1000)
     */
    function calculateReputationScore(
        uint256 completed,
        uint256 successful,
        uint256 failed
    ) public pure returns (uint256) {
        if (completed == 0) return 500; // Neutral starting score
        
        uint256 total = successful + failed;
        if (total == 0) return 500;
        
        // Weighted score: completion rate + quality rate
        uint256 completionWeight = (successful * 1000) / total;
        uint256 qualityBonus = (successful >= 10) ? 100 : 0; // Bonus for 10+ successful jobs
        
        return completionWeight + qualityBonus;
    }
    
    /**
     * @dev Set approved verifier
     */
    function setApprovedVerifier(address verifier, bool approved) external onlyOwner {
        approvedVerifiers[verifier] = approved;
    }
    
    /**
     * @dev Get attestation details
     */
    function getAttestation(uint256 attestationId) external view returns (AttestationRecord memory) {
        return _attestations[attestationId];
    }
    
    /**
     * @dev Get all attestations for a provider
     */
    function getProviderAttestations(address provider) external view returns (uint256[] memory) {
        return _providerAttestations[provider];
    }
    
    /**
     * @dev Get reputation for an address
     */
    function getReputation(address provider) external view returns (Reputation memory) {
        return reputations[provider];
    }
}
