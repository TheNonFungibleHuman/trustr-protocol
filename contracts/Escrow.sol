// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IEscrow.sol";

/**
 * @title Trustr Escrow
 * @dev Policy-governed escrow contract for trustless payments between clients and providers
 * Supports both human users (via MetaMask) and AI agents (via Locus wallets)
 */
contract Escrow is IEscrow, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    
    uint256 private _jobCounter;
    mapping(uint256 => Job) private _jobs;
    mapping(uint256 => Attestation[]) private _attestations;
    mapping(address => uint256[]) private _userJobs;
    mapping(address => bool) public approvedVerifiers;
    mapping(address => uint256) public platformFeeDiscount; // Basis points discount for trusted agents
    
    uint256 public constant PLATFORM_FEE_BPS = 50; // 0.5% platform fee (50 basis points)
    uint256 public constant MAX_DISPUTE_DAYS = 7;
    address public immutable nativeToken = address(0);
    
    constructor() Ownable(msg.sender) {}
    
    modifier onlyJobClient(uint256 jobId) {
        require(_jobs[jobId].client == msg.sender, "Not job client");
        _;
    }
    
    modifier onlyJobProvider(uint256 jobId) {
        require(_jobs[jobId].provider == msg.sender, "Not job provider");
        _;
    }
    
    modifier onlyJobParticipant(uint256 jobId) {
        require(
            _jobs[jobId].client == msg.sender || _jobs[jobId].provider == msg.sender,
            "Not job participant"
        );
        _;
    }
    
    modifier jobExists(uint256 jobId) {
        require(_jobs[jobId].id != 0 || jobId == 1 && _jobCounter >= 1, "Job does not exist");
        _;
    }
    
    /**
     * @dev Create a new escrow job
     * @param provider Address of the service provider (human or AI agent)
     * @param description Job description
     * @param paymentAmount Payment amount in paymentToken units
     * @param paymentToken ERC20 token address (address(0) for native ETH)
     * @param deadline Unix timestamp for job deadline
     * @param verificationType Type of verification required
     * @param metadata Additional job metadata (IPFS hash or JSON)
     */
    function createJob(
        address provider,
        string calldata description,
        uint256 paymentAmount,
        address paymentToken,
        uint256 deadline,
        VerificationType verificationType,
        string calldata metadata
    ) external payable nonReentrant returns (uint256) {
        require(provider != address(0), "Invalid provider");
        require(paymentAmount > 0, "Payment must be > 0");
        require(deadline > block.timestamp, "Invalid deadline");
        require(
            verificationType == VerificationType.Manual ||
            verificationType == VerificationType.AI ||
            verificationType == VerificationType.Hybrid,
            "Invalid verification type"
        );
        
        _jobCounter++;
        uint256 jobId = _jobCounter;
        
        // Handle payment (native or ERC20)
        if (paymentToken == nativeToken) {
            require(msg.value == paymentAmount, "Incorrect native token amount");
        } else {
            require(msg.value == 0, "Native token sent with ERC20 payment");
            IERC20(paymentToken).safeTransferFrom(msg.sender, address(this), paymentAmount);
        }
        
        _jobs[jobId] = Job({
            id: jobId,
            client: msg.sender,
            provider: provider,
            description: description,
            deliverableHash: "",
            paymentAmount: paymentAmount,
            paymentToken: paymentToken,
            status: JobStatus.Created,
            verificationType: verificationType,
            createdAt: block.timestamp,
            deadlineAt: deadline,
            metadata: metadata
        });
        
        _userJobs[msg.sender].push(jobId);
        _userJobs[provider].push(jobId);
        
        emit JobCreated(jobId, msg.sender, provider, paymentAmount, paymentToken);
        
        return jobId;
    }
    
    /**
     * @dev Submit work for a job
     * @param jobId Job ID
     * @param deliverableHash Hash of the deliverable (IPFS CID or content hash)
     * @param attestation Optional AI-generated attestation from Venice AI
     */
    function submitWork(
        uint256 jobId,
        string calldata deliverableHash,
        string calldata attestation
    ) external onlyJobProvider(jobId) nonReentrant {
        Job storage job = _jobs[jobId];
        require(job.status == JobStatus.Created || job.status == JobStatus.InProgress, "Invalid job status");
        require(bytes(deliverableHash).length > 0, "Deliverable hash required");
        
        job.deliverableHash = deliverableHash;
        job.status = JobStatus.Submitted;
        
        emit JobSubmitted(jobId, msg.sender, deliverableHash);
    }
    
    /**
     * @dev Verify submitted work (for Manual or Hybrid verification)
     * @param jobId Job ID
     * @param approved Approval status
     * @param reason Reason for approval/rejection
     */
    function verifyWork(
        uint256 jobId,
        bool approved,
        string calldata reason
    ) external onlyJobClient(jobId) nonReentrant {
        Job storage job = _jobs[jobId];
        require(job.status == JobStatus.Submitted, "Job not submitted");
        
        _attestations[jobId].push(Attestation({
            jobId: jobId,
            verifier: msg.sender,
            approved: approved,
            reason: reason,
            timestamp: block.timestamp,
            signature: ""
        }));
        
        if (approved) {
            job.status = JobStatus.Verified;
            emit JobVerified(jobId, msg.sender, true);
        } else {
            job.status = JobStatus.Disputed;
            emit JobVerified(jobId, msg.sender, false);
        }
    }
    
    /**
     * @dev Release payment to provider after verification
     * @param jobId Job ID
     */
    function releasePayment(uint256 jobId) external nonReentrant {
        Job storage job = _jobs[jobId];
        require(
            job.status == JobStatus.Verified || job.status == JobStatus.Completed,
            "Job not verified"
        );
        require(job.provider != address(0), "Invalid provider");
        
        uint256 fee = (job.paymentAmount * PLATFORM_FEE_BPS) / 10000;
        uint256 amountToProvider = job.paymentAmount - fee;
        
        job.status = JobStatus.Completed;
        
        // Transfer fee to platform
        if (job.paymentToken == nativeToken) {
            (bool feeSuccess,) = payable(owner()).call{value: fee}("");
            require(feeSuccess, "Fee transfer failed");
            
            // Transfer payment to provider
            (bool success,) = payable(job.provider).call{value: amountToProvider}("");
            require(success, "Payment transfer failed");
        } else {
            IERC20(job.paymentToken).safeTransfer(owner(), fee);
            IERC20(job.paymentToken).safeTransfer(job.provider, amountToProvider);
        }
        
        emit PaymentReleased(jobId, job.provider, amountToProvider);
    }
    
    /**
     * @dev Open a dispute for a job
     * @param jobId Job ID
     * @param reason Dispute reason
     */
    function openDispute(uint256 jobId, string calldata reason) external onlyJobParticipant(jobId) nonReentrant {
        Job storage job = _jobs[jobId];
        require(
            job.status == JobStatus.Submitted || job.status == JobStatus.InProgress,
            "Invalid dispute status"
        );
        
        job.status = JobStatus.Disputed;
        
        emit DisputeOpened(jobId, msg.sender, reason);
    }
    
    /**
     * @dev Resolve a dispute (owner/arbiter only)
     * @param jobId Job ID
     * @param refundToClient If true, refund to client; else pay provider
     */
    function resolveDispute(uint256 jobId, bool refundToClient) external onlyOwner nonReentrant {
        Job storage job = _jobs[jobId];
        require(job.status == JobStatus.Disputed, "Not in dispute");
        
        job.status = refundToClient ? JobStatus.Refunded : JobStatus.Completed;
        
        if (refundToClient) {
            if (job.paymentToken == nativeToken) {
                (bool success,) = payable(job.client).call{value: job.paymentAmount}("");
                require(success, "Refund failed");
            } else {
                IERC20(job.paymentToken).safeTransfer(job.client, job.paymentAmount);
            }
        } else {
            uint256 fee = (job.paymentAmount * PLATFORM_FEE_BPS) / 10000;
            uint256 amountToProvider = job.paymentAmount - fee;
            
            if (job.paymentToken == nativeToken) {
                (bool feeSuccess,) = payable(owner()).call{value: fee}("");
                require(feeSuccess, "Fee transfer failed");
                
                (bool success,) = payable(job.provider).call{value: amountToProvider}("");
                require(success, "Payment failed");
            } else {
                IERC20(job.paymentToken).safeTransfer(owner(), fee);
                IERC20(job.paymentToken).safeTransfer(job.provider, amountToProvider);
            }
        }
        
        emit DisputeResolved(jobId, msg.sender, refundToClient);
    }
    
    /**
     * @dev Cancel a job (client only, before submission)
     * @param jobId Job ID
     */
    function cancelJob(uint256 jobId) external onlyJobClient(jobId) nonReentrant {
        Job storage job = _jobs[jobId];
        require(
            job.status == JobStatus.Created || job.status == JobStatus.InProgress,
            "Cannot cancel"
        );
        
        job.status = JobStatus.Cancelled;
        
        // Refund full amount
        if (job.paymentToken == nativeToken) {
            (bool success,) = payable(job.client).call{value: job.paymentAmount}("");
            require(success, "Refund failed");
        } else {
            IERC20(job.paymentToken).safeTransfer(job.client, job.paymentAmount);
        }
        
        emit JobCancelled(jobId, msg.sender);
    }
    
    /**
     * @dev Set approved verifier address
     * @param verifier Verifier address
     * @param approved Approval status
     */
    function setApprovedVerifier(address verifier, bool approved) external onlyOwner {
        approvedVerifiers[verifier] = approved;
    }
    
    /**
     * @dev Get job details
     */
    function getJob(uint256 jobId) external view returns (Job memory) {
        return _jobs[jobId];
    }
    
    /**
     * @dev Get job status
     */
    function getJobStatus(uint256 jobId) external view returns (JobStatus) {
        return _jobs[jobId].status;
    }
    
    /**
     * @dev Get attestations for a job
     */
    function getAttestations(uint256 jobId) external view returns (Attestation[] memory) {
        return _attestations[jobId];
    }
    
    /**
     * @dev Get all jobs for a user
     */
    function getUserJobs(address user) external view returns (uint256[] memory) {
        return _userJobs[user];
    }
    
    /**
     * @dev Get contract balance for emergency withdrawal
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Emergency withdrawal (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        (bool success,) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}
