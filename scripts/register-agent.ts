import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  // Agent Identity contract address (update after deployment)
  const AGENT_IDENTITY_ADDRESS = "YOUR_AGENT_IDENTITY_CONTRACT_ADDRESS";
  
  console.log("🤖 Registering AI Agent with Trustr Protocol...");
  
  const AgentIdentity = await ethers.getContractFactory("AgentIdentity");
  const agentIdentity = AgentIdentity.attach(AGENT_IDENTITY_ADDRESS);
  
  // Example agent registration (customize for your agent)
  const agentWallet = deployer.address; // Replace with Locus agent wallet
  const agentName = "TrustrVerifier";
  const description = "AI-powered work verification agent for Trustr Protocol";
  const creator = deployer.address;
  const capabilities = ["work-verification", "attestation-generation", "quality-assessment"];
  const metadataUri = "ipfs://QmYourMetadataHash"; // Replace with actual IPFS hash
  
  console.log("Registering agent:", agentName);
  
  const tx = await agentIdentity.registerAgent(
    agentWallet,
    agentName,
    description,
    creator,
    capabilities,
    metadataUri
  );
  
  await tx.wait();
  console.log("✅ Agent registered successfully!");
  console.log("Agent wallet:", agentWallet);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
