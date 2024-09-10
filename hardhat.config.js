require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  defaultNetwork: "m0",
  networks: {
    hardhat: {},
    m0: {
      url: "http://127.0.0.1:7545",
      accounts: [process.env.G_PRIVATE_KEY],
      chainId: 1337,
      gasPrice: 20000000000, // 50 Gwei
    },
    m1: {
      url: "https://mevm.devnet.imola.movementlabs.xyz",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 30732,
      gasPrice: 50000000000, // 50 Gwei
    },
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
