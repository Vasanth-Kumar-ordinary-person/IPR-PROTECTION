const deployContract = require('../config/deployContract');
const BlockchainConfig = require('../config/blockchain');
require('dotenv').config();

async function initializeDevelopment() {
    try {
        console.log('Initializing development environment...');

        // Deploy contract
        const contractAddress = await deployContract();
        console.log('Contract deployed at:', contractAddress);

        // Initialize blockchain config
        const blockchainConfig = await BlockchainConfig.getContract();
        const accounts = await BlockchainConfig.getAccounts();

        // Add first account as admin
        console.log('Setting up admin account:', accounts[0]);

        // Add second account as patent officer
        const officerTx = await blockchainConfig.methods.addPatentOfficer(accounts[1])
            .send({ from: accounts[0] });
        console.log('Added patent officer:', accounts[1]);

        console.log('Development environment initialized successfully!');
        console.log('Contract Address:', contractAddress);
        console.log('Admin Account:', accounts[0]);
        console.log('Officer Account:', accounts[1]);

        return {
            contractAddress,
            adminAccount: accounts[0],
            officerAccount: accounts[1]
        };
    } catch (error) {
        console.error('Error initializing development environment:', error);
        throw error;
    }
}

// Run initialization if called directly
if (require.main === module) {
    initializeDevelopment()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = initializeDevelopment;