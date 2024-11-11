require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    // Local Ganache network
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: ["0x9fc114eb003f362d25ae7fd92328e5ddb33ed61489eafccdeabe46c73cee272e"]// Your Ganache private key
    },
    // Local Hardhat network
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    // Add other networks as needed (e.g., testnet, mainnet)
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test"
  }
};