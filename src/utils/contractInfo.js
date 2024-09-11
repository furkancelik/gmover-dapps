// export const contractAddress = "0x07A1ffb5caE2850c1c76FD06b5038f97E44eE2E1";
// export const contractAddress = "0xCf04B3ad5A6c4410E2EB9b7E3a353B823869b7F0";

const landGameContract = require("../../artifacts/contracts/LandGame.sol/LandGame.json");
const gmoveContract = require("../../artifacts/contracts/GMOVE.sol/GMOVE.json");
const treeNftContract = require("../../artifacts/contracts/TreeNFT.sol/TreeNFT.json");
const tractorNftContract = require("../../artifacts/contracts/TractorNFT.sol/TractorNFT.json");
const treeStakingContract = require("../../artifacts/contracts/TreeStaking.sol/TreeStaking.json");
const tractorStakingContract = require("../../artifacts/contracts/TractorStaking.sol/TractorStaking.json");

export const CONTRACTS = {
  landGameContract: {
    address: "0x0F66A1C3a0cCDa981CbBA405582036c0655Fe146",
    ABI: landGameContract.abi,
  },

  gmoveTokenContract: {
    address: "0xc30682F61f7b669aca86Be2a7Ff7a456a8b20Deb",
    ABI: gmoveContract.abi,
  },
  treeNftContract: {
    address: "0xD88a9472411F01E35CCe8D255913Fc2bfBDbF62E",
    ABI: treeNftContract.abi,
  },
  tractorNftContract: {
    address: "0x69FFf74aF4a6aAb5eDafCF12d9ff4201112071c6",
    ABI: tractorNftContract.abi,
  },
  treeStakingContract: {
    address: "0x63Fc030CbbAc3bC7B4859402F8E35AB53C0d3522",
    ABI: treeStakingContract.abi,
  },
  tractorStakingContract: {
    address: "0x6a7721e83B5829D09F6eAAf02BAd080779f5E2fF",
    ABI: tractorStakingContract.abi,
  },
};
