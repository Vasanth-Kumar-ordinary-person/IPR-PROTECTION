const Web3 = require('web3');
const contractArtifact = require('../../hardhat/artifacts/contracts/IPProtection.sol/IPProtection.json');
require('dotenv').config();

async function deployContract() {
    try {
        // Connect to Ganache
        const web3 = new Web3(process.env.GANACHE_URL || 'http://127.0.0.1:7545');
        
        // Get accounts
        const accounts = await web3.eth.getAccounts();
        console.log('Deploying from account:', accounts[0]);

        // Create contract instance
        const IPProtection = new web3.eth.Contract(contractArtifact.abi);
        
        // Deploy contract
        const deploy = IPProtection.deploy({
            data: contractArtifact.bytecode,
            arguments: [] // Add constructor arguments if any
        });

        // Estimate gas
        const gas = await deploy.estimateGas();

        // Send deployment transaction
        const contract = await deploy.send({
            from: accounts[0],
            gas: Math.floor(gas * 1.2) // Add 20% buffer
        });

        console.log('Contract deployed to:', contract.options.address);
        return contract.options.address;
    } catch (error) {
        console.error('Deployment error:', error);
        throw error;
    }
}

// Run deployment if called directly
if (require.main === module) {
    deployContract()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = deployContract; 