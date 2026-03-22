// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Trustr Agent Identity (ERC-8004 compatible)
 * @dev Manages AI agent registration and identity on Base blockchain
 * Follows ERC-8004 standard for agent identity
 */
contract AgentIdentity is ReentrancyGuard, Ownable {
    struct AgentProfile {
        address walletAddress;
        string name;
        string description;
        string creatorAddress; // Human owner/creator
        string[] capabilities;
        string metadataUri; // IPFS URI for detailed metadata
        bool verified;
        uint256 registeredAt;
        uint256 reputationScore;
    }
    
    mapping(address => AgentProfile) private _agents;
    mapping(address => bool) public isRegisteredAgent;
    mapping(string => address) private _nameToAddress;
    address[] private _registeredAgents;
    
    event AgentRegistered(
        address indexed walletAddress,
        string name,
        string creatorAddress
    );
    
    event AgentVerified(
        address indexed walletAddress,
        bool verified
    );
    
    event AgentReputationUpdated(
        address indexed walletAddress,
        uint256 newScore
    );
    
    constructor() Ownable(msg.sender) {}
    
    modifier onlyUnregistered(address walletAddress) {
        require(!isRegisteredAgent[walletAddress], "Already registered");
        _;
    }
    
    /**
     * @dev Register an AI agent identity (ERC-8004)
     * @param walletAddress Agent's wallet address (Locus wallet or contract)
     * @param name Agent name
     * @param description Agent description
     * @param creatorAddress Human creator/owner address
     * @param capabilities Array of agent capabilities
     * @param metadataUri IPFS URI for detailed metadata
     */
    function registerAgent(
        address walletAddress,
        string calldata name,
        string calldata description,
        string calldata creatorAddress,
        string[] calldata capabilities,
        string calldata metadataUri
    ) external onlyUnregistered(walletAddress) {
        require(walletAddress != address(0), "Invalid address");
        require(bytes(name).length > 0, "Name required");
        require(bytes(creatorAddress).length > 0, "Creator required");
        
        _agents[walletAddress] = AgentProfile({
            walletAddress: walletAddress,
            name: name,
            description: description,
            creatorAddress: creatorAddress,
            capabilities: capabilities,
            metadataUri: metadataUri,
            verified: false,
            registeredAt: block.timestamp,
            reputationScore: 500 // Neutral starting score
        });
        
        isRegisteredAgent[walletAddress] = true;
        _nameToAddress[name] = walletAddress;
        _registeredAgents.push(walletAddress);
        
        emit AgentRegistered(walletAddress, name, creatorAddress);
    }
    
    /**
     * @dev Verify an agent (owner only)
     */
    function verifyAgent(address walletAddress, bool verified) external onlyOwner {
        require(isRegisteredAgent[walletAddress], "Not registered");
        _agents[walletAddress].verified = verified;
        emit AgentVerified(walletAddress, verified);
    }
    
    /**
     * @dev Update agent reputation score
     */
    function updateAgentReputation(address walletAddress, uint256 newScore) external onlyOwner {
        require(isRegisteredAgent[walletAddress], "Not registered");
        _agents[walletAddress].reputationScore = newScore;
        emit AgentReputationUpdated(walletAddress, newScore);
    }
    
    /**
     * @dev Get agent profile
     */
    function getAgent(address walletAddress) external view returns (AgentProfile memory) {
        require(isRegisteredAgent[walletAddress], "Not registered");
        return _agents[walletAddress];
    }
    
    /**
     * @dev Get agent by name
     */
    function getAgentByName(string calldata name) external view returns (AgentProfile memory) {
        address walletAddress = _nameToAddress[name];
        require(walletAddress != address(0), "Agent not found");
        return _agents[walletAddress];
    }
    
    /**
     * @dev Get all registered agents
     */
    function getAllAgents() external view returns (address[] memory) {
        return _registeredAgents;
    }
    
    /**
     * @dev Check if address is a registered agent
     */
    function checkAgent(address walletAddress) external view returns (bool) {
        return isRegisteredAgent[walletAddress];
    }
}
