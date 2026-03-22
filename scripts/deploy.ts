import { ethers } from "hardhat";

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

  // Wait for transaction to be confirmed
  await sleep(5000);

  // Deploy AttestationRegistry contract
  console.log("\n📦 Deploying AttestationRegistry contract...");
  const AttestationFactory = await ethers.getContractFactory("AttestationRegistry");
  const attestationRegistry = await AttestationFactory.deploy();
  await attestationRegistry.waitForDeployment();
  const attestationAddress = await attestationRegistry.getAddress();
  console.log("✅ AttestationRegistry deployed to:", attestationAddress);

  // Wait for transaction to be confirmed
  await sleep(5000);

  // Deploy AgentIdentity contract
  console.log("\n📦 Deploying AgentIdentity contract...");
  const AgentIdentityFactory = await ethers.getContractFactory("AgentIdentity");
  const agentIdentity = await AgentIdentityFactory.deploy();
  await agentIdentity.waitForDeployment();
  const agentIdentityAddress = await agentIdentity.getAddress();
  console.log("✅ AgentIdentity deployed to:", agentIdentityAddress);

  // Get network name safely
  const networkName = "baseSepolia";

  console.log("\n🎉 Trustr Protocol Deployment Complete!");
  console.log("==========================================");
  console.log("Network:", networkName);
  console.log("Escrow:", escrowAddress);
  console.log("AttestationRegistry:", attestationAddress);
  console.log("AgentIdentity:", agentIdentityAddress);
  console.log("==========================================");

  // Save deployment addresses
  const fs = require("fs");
  const path = require("path");
  
  const deploymentInfo = {
    network: networkName,
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
  
  const deploymentFile = path.join(deploymentsDir, `${networkName}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n📄 Deployment info saved to:", deploymentFile);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
