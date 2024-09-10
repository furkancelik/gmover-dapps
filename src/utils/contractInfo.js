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
    address: "0x82Aa3219AEf4c1A6c9368c4E19a3535ecF0d9170",
    ABI: landGameContract.abi,
  },

  gmoveTokenContract: {
    address: "0x4586a2FA371d8cbD562947C85E90d00aF232FCBF",
    ABI: gmoveContract.abi,
  },
  treeNftContract: {
    address: "0xD94A11D4bF67c355e73Ec3a72Db301E8A5972DC2",
    ABI: treeNftContract.abi,
  },
  tractorNftContract: {
    address: "0x6552A3E2bb930851792274AC4483f1407f6D570F",
    ABI: tractorNftContract.abi,
  },
  treeStakingContract: {
    address: "0x3538721c5b90be6Bef0D3Ec738cA46f469Bcb9a9",
    ABI: treeStakingContract.abi,
  },
  tractorStakingContract: {
    address: "0x3FB4C0891bb93430af6D7Fd38bf6639cf201c3Df",
    ABI: tractorStakingContract.abi,
  },
};
