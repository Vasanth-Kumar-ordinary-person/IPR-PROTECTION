const { Web3 } = require('web3');
const path = require('path');
const fs = require('fs');

class BlockchainConfig {
    constructor() {
        this.web3 = null;
        this.contract = null;
        this.initialized = false;
        this.networkId = null;
        this.artifactPath = path.join(__dirname, '../../hardhat/artifacts/contracts/IPProtection.sol/IPProtection.json');
    }

    // Add this method
    loadContractArtifact() {
        try {
            const artifactFile = fs.readFileSync(this.artifactPath, 'utf8');
            return JSON.parse(artifactFile);
        } catch (error) {
            console.error('Error loading contract artifact:', error);
            throw new Error('Contract artifact not found. Make sure to compile your Hardhat contract first.');
        }
    }

    async init() {
        try {
            // Create Web3 instance with provider
            const provider = process.env.GANACHE_URL || 'http://127.0.0.1:7545';
            this.web3 = new Web3(provider);
            
            // Load contract artifact
            const contractArtifact = this.loadContractArtifact(); // Removed await since it's not async
            
            // Get network ID
            this.networkId = await this.web3.eth.net.getId();

            // Initialize contract
            this.contract = new this.web3.eth.Contract(
                contractArtifact.abi,
                process.env.CONTRACT_ADDRESS
            );

            // Test connection
            const isConnected = await this.web3.eth.net.isListening();
            
            if (isConnected) {
                this.initialized = true;
                console.log('Connected to Ganache on network ID:', this.networkId);
            } else {
                throw new Error('Failed to connect to blockchain');
            }
        } catch (error) {
            console.error('Blockchain connection error:', error);
            throw error;
        }
    }

    async getContract() {
        if (!this.initialized) {
            await this.init();
        }
        return this.contract;
    }

    async getWeb3() {
        if (!this.initialized) {
            await this.init();
        }
        return this.web3;
    }

    async getAccounts() {
        if (!this.initialized) {
            await this.init();
        }
        return await this.web3.eth.getAccounts();
    }
}

module.exports = new BlockchainConfig();