const hre = require("hardhat");

async function main() {
  try {
    // Get the contract factory
    const IPProtection = await hre.ethers.getContractFactory("IPProtection");
    
    console.log("Deploying IPProtection...");
    
    // Deploy the contract
    const ipProtection = await IPProtection.deploy();
    
    // Wait for deployment to complete
    await ipProtection.waitForDeployment();

    // Get the deployed contract address
    const deployedAddress = await ipProtection.getAddress();
    
    console.log("IPProtection deployed to:", deployedAddress);
    
    return deployedAddress;
  } catch (error) {
    console.error("Deployment error:", error);
    process.exit(1);
  }
}

// Execute deployment
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = main;