import Web3 from 'web3';
import contractABI from '../contracts/IPProtection.json';

class Web3Service {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.account = null;
  }

  async init() {
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.web3 = new Web3(window.ethereum);
        
        // Get the contract
        const networkId = await this.web3.eth.net.getId();
        const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
        
        this.contract = new this.web3.eth.Contract(
          contractABI.abi,
          contractAddress
        );

        // Get the current account
        const accounts = await this.web3.eth.getAccounts();
        this.account = accounts[0];

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          this.account = accounts[0];
          window.location.reload();
        });

        return true;
      } catch (error) {
        console.error('Error initializing Web3:', error);
        return false;
      }
    } else {
      console.error('Please install MetaMask!');
      return false;
    }
  }

  async filePatent(ipfsHash) {
    if (!this.contract || !this.account) {
      throw new Error('Web3 not initialized');
    }

    try {
      return await this.contract.methods
        .filePatent(ipfsHash)
        .send({ from: this.account });
    } catch (error) {
      console.error('Error filing patent:', error);
      throw error;
    }
  }

  async getPatent(patentId) {
    if (!this.contract) {
      throw new Error('Web3 not initialized');
    }

    try {
      return await this.contract.methods.patents(patentId).call();
    } catch (error) {
      console.error('Error getting patent:', error);
      throw error;
    }
  }

  async getPatentCount() {
    if (!this.contract) {
      throw new Error('Web3 not initialized');
    }

    try {
      return await this.contract.methods.patentCount().call();
    } catch (error) {
      console.error('Error getting patent count:', error);
      throw error;
    }
  }
}

export default new Web3Service(); 