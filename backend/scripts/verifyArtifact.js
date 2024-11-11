const path = require('path');
const fs = require('fs');

function verifyArtifact() {
    const artifactPath = path.join(__dirname, '../../hardhat/artifacts/contracts/IPProtection.sol/IPProtection.json');
    
    try {
        if (fs.existsSync(artifactPath)) {
            const artifact = JSON.parse(fs.readFileSync(artifactPath));
            console.log('✅ Contract artifact found and valid!');
            console.log('Contract name:', artifact.contractName);
            console.log('Artifact path:', artifactPath);
            return true;
        } else {
            console.error('❌ Contract artifact not found at:', artifactPath);
            console.log('\nPlease ensure:');
            console.log('1. You have compiled your Hardhat contract');
            console.log('2. The artifact path is correct');
            console.log('3. Run "npx hardhat compile" in your hardhat directory');
            return false;
        }
    } catch (error) {
        console.error('Error verifying artifact:', error);
        return false;
    }
}

// Run verification if called directly
if (require.main === module) {
    verifyArtifact();
}

module.exports = verifyArtifact; 