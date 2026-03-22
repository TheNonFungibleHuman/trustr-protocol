import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Trustr Protocol to Base...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy Escrow contract
  console.log("\n📦 Deploying Escrow contract...");
  const EscrowFactory = await ethers.getContractFactory("Escrow");
  const escrow = await EscrowFactory.deploy();
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log("✅ Escrow deployed to:", escrowAddress);

  // Deploy AttestationRegistry contract
  console.log("\n📦 Deploying AttestationRegistry contract...");
  const AttestationFactory = await ethers.getContractFactory("AttestationRegistry");
  const attestationRegistry = await AttestationFactory.deploy();
  await attestationRegistry.waitForDeployment();
  const attestationAddress = await attestationRegistry.getAddress();
  console.log("✅ AttestationRegistry deployed to:", attestationAddress);

  // Deploy AgentIdentity contract
  console.log("\n📦 Deploying AgentIdentity contract...");
  const AgentIdentityFactory = await ethers.getContractFactory("AgentIdentity");
  const agentIdentity = await AgentIdentityFactory.deploy();
  await agentIdentity.waitForDeployment();
  const agentIdentityAddress = await agentIdentity.getAddress();
  console.log("✅ AgentIdentity deployed to:", agentIdentityAddress);

  console.log("\n🎉 Trustr Protocol Deployment Complete!");
  console.log("==========================================");
  console.log("Network:", ethers.provider._network.name);
  console.log("Escrow:", escrowAddress);
  console.log("AttestationRegistry:", attestationAddress);
  console.log("AgentIdentity:", agentIdentityAddress);
  console.log("==========================================");

  // Save deployment addresses
  const fs = require("fs");
  const path = require("path");
  
  const deploymentInfo = {
    network: ethers.provider._network.name,
    deployer: deployer.address,
    escrow: escrowAddress,
    attestationRegistry: attestationAddress,
    agentIdentity: agentIdentityAddress,
    deployedAt: new Date().toISOString()
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const deploymentFile = path.join(deploymentsDir, `${ethers.provider._network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n📄 Deployment info saved to:", deploymentFile);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
