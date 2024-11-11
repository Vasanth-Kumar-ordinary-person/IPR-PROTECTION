const BlockchainConfig = require('./config/blockchain');
const IPFSConfig = require('./config/ipfs');
const server = require('./server');

async function startServer() {
    try {
        // Initialize blockchain connection
        await BlockchainConfig.init();
        console.log('Blockchain connection initialized');

        // Initialize IPFS
        await IPFSConfig.init();
        console.log('IPFS connection initialized');

        // Server is already started in server.js
        console.log('All systems initialized successfully');
    } catch (error) {
        console.error('Error during initialization:', error);
        process.exit(1);
    }
}

startServer(); 