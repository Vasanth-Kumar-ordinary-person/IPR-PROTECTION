const BlockchainConfig = require('./blockchain');

class ContractInteractions {
    static async filePatent(ipfsHash, fromAddress) {
        try {
            const blockchainConfig = await BlockchainConfig.getContract();
            const gas = await BlockchainConfig.estimateGas(
                blockchainConfig.methods.filePatent,
                fromAddress,
                ipfsHash
            );

            const result = await blockchainConfig.methods.filePatent(ipfsHash)
                .send({
                    from: fromAddress,
                    gas
                });

            return {
                success: true,
                transactionHash: result.transactionHash,
                patentId: result.events.PatentFiled.returnValues.id
            };
        } catch (error) {
            console.error('Error filing patent:', error);
            throw error;
        }
    }

    static async approvePatent(patentId, officerAddress) {
        try {
            const blockchainConfig = await BlockchainConfig.getContract();
            const gas = await BlockchainConfig.estimateGas(
                blockchainConfig.methods.approvePatent,
                officerAddress,
                patentId
            );

            const result = await blockchainConfig.methods.approvePatent(patentId)
                .send({
                    from: officerAddress,
                    gas
                });

            return {
                success: true,
                transactionHash: result.transactionHash
            };
        } catch (error) {
            console.error('Error approving patent:', error);
            throw error;
        }
    }

    static async getPatent(patentId) {
        try {
            const blockchainConfig = await BlockchainConfig.getContract();
            const patent = await blockchainConfig.methods.getPatent(patentId).call();
            return patent;
        } catch (error) {
            console.error('Error getting patent:', error);
            throw error;
        }
    }

    static async isPatentOfficer(address) {
        try {
            const blockchainConfig = await BlockchainConfig.getContract();
            return await blockchainConfig.methods.patentOfficers(address).call();
        } catch (error) {
            console.error('Error checking officer status:', error);
            throw error;
        }
    }
}

module.exports = ContractInteractions; 