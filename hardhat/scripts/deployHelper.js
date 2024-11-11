const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runDeployment() {
    try {
        // Compile contracts
        console.log("Compiling contracts...");
        await executeCommand("npx hardhat compile");

        // Deploy to network (e.g., ganache)
        console.log("\nDeploying to Ganache...");
        const deployCommand = "npx hardhat run scripts/deploy.js --network ganache";
        const { stdout } = await executeCommand(deployCommand);

        // Extract contract address from deployment output
        const addressMatch = stdout.match(/IPProtection deployed to: (0x[a-fA-F0-9]{40})/);
        if (!addressMatch) {
            throw new Error("Could not find contract address in deployment output");
        }

        const contractAddress = addressMatch[1];
        
        // Update .env file with new contract address
        const envPath = path.join(__dirname, '../../.env');
        let envContent = '';
        
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
            // Replace existing CONTRACT_ADDRESS or add new one
            if (envContent.includes('CONTRACT_ADDRESS=')) {
                envContent = envContent.replace(
                    /CONTRACT_ADDRESS=.*/,
                    `CONTRACT_ADDRESS=${contractAddress}`
                );
            } else {
                envContent += `\nCONTRACT_ADDRESS=${contractAddress}\n`;
            }
        } else {
            envContent = `CONTRACT_ADDRESS=${contractAddress}\n`;
        }

        fs.writeFileSync(envPath, envContent);

        console.log("\nDeployment successful!");
        console.log("Contract address:", contractAddress);
        console.log("Environment file updated!");

        return contractAddress;
    } catch (error) {
        console.error("Deployment failed:", error);
        process.exit(1);
    }
}

function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }
            console.log(stdout);
            resolve({ stdout, stderr });
        });
    });
}

// Run deployment if called directly
if (require.main === module) {
    runDeployment();
}

module.exports = runDeployment; 