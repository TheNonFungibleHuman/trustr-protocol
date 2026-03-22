// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IEscrow {
    enum JobStatus { Created, InProgress, Submitted, Verified, Disputed, Completed, Cancelled, Refunded }
    enum VerificationType { Manual, AI, Hybrid }
    
    struct Job {
        uint256 id;
        address client;
        address provider;
        string description;
        string deliverableHash;
        uint256 paymentAmount;
        address paymentToken;
        JobStatus status;
        VerificationType verificationType;
        uint256 createdAt;
        uint256 deadlineAt;
        string metadata; // IPFS hash or JSON string
    }
    
    struct Attestation {
        uint256 jobId;
        address verifier;
        bool approved;
        string reason;
        uint256 timestamp;
        bytes signature;
    }
    
    event JobCreated(
        uint256 indexed jobId,
        address indexed client,
        address indexed provider,
        uint256 paymentAmount,
        address paymentToken
    );
    
    event JobSubmitted(
        uint256 indexed jobId,
        address indexed provider,
        string deliverableHash
    );
    
    event JobVerified(
        uint256 indexed jobId,
        address indexed verifier,
        bool approved
    );
    
    event PaymentReleased(
        uint256 indexed jobId,
        address indexed provider,
        uint256 amount
    );
    
    event DisputeOpened(
        uint256 indexed jobId,
        address indexed opener,
        string reason
    );
    
    event DisputeResolved(
        uint256 indexed jobId,
        address resolver,
        bool refundedToClient
    );
    
    event JobCancelled(
        uint256 indexed jobId,
        address indexed canceller
    );
    
    function createJob(
        address provider,
        string calldata description,
        uint256 paymentAmount,
        address paymentToken,
        uint256 deadline,
        VerificationType verificationType,
        string calldata metadata
    ) external payable returns (uint256);
    
    function submitWork(uint256 jobId, string calldata deliverableHash, string calldata attestation) external;
    
    function verifyWork(uint256 jobId, bool approved, string calldata reason) external;
    
    function releasePayment(uint256 jobId) external;
    
    function openDispute(uint256 jobId, string calldata reason) external;
    
    function resolveDispute(uint256 jobId, bool refundToClient) external;
    
    function cancelJob(uint256 jobId) external;
    
    function getJob(uint256 jobId) external view returns (Job memory);
    
    function getJobStatus(uint256 jobId) external view returns (JobStatus);
}
