const { create } = require('ipfs-http-client');

let ipfs = null;

const IPFSConfig = {
    init: async function() {
        try {
            // Configuration for ipfs-http-client@50.0.2
            ipfs = create({
                host: '127.0.0.1',
                port: 5001,
                protocol: 'http'
            });

            // Test connection
            const nodeId = await ipfs.id();
            console.log('Connected to IPFS node:', nodeId.id);
            
            return ipfs;
        } catch (error) {
            console.error('IPFS initialization error:', error);
            throw new Error('Failed to initialize IPFS connection: ' + error.message);
        }
    },

    getIPFS: function() {
        if (!ipfs) {
            throw new Error('IPFS not initialized');
        }
        return ipfs;
    },

    uploadToIPFS: async function(buffer) {
        try {
            if (!ipfs) {
                throw new Error('IPFS not initialized');
            }
            const { cid } = await ipfs.add(buffer);
            return cid.toString();
        } catch (error) {
            console.error('IPFS upload error:', error);
            throw error;
        }
    },

    getFromIPFS: async function(hash) {
        try {
            if (!ipfs) {
                throw new Error('IPFS not initialized');
            }
            const chunks = [];
            for await (const chunk of ipfs.cat(hash)) {
                chunks.push(chunk);
            }
            return Buffer.concat(chunks);
        } catch (error) {
            console.error('IPFS retrieval error:', error);
            throw error;
        }
    }
};

module.exports = IPFSConfig;