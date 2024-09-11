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
    address: "0xB9411caB8fC198c49d72137ffBc04A97ca70aF82",
    ABI: landGameContract.abi,
  },

  gmoveTokenContract: {
    address: "0x28a5e22F6772b919274C39301C2DfAFEC1F383e0",
    ABI: gmoveContract.abi,
  },
  treeNftContract: {
    address: "0xC6EcDC1ccCb408033bf0D5e7eC7Dc43297f09E25",
    ABI: treeNftContract.abi,
  },
  tractorNftContract: {
    address: "0x0e54626B24ECb6BA26d3640D4a1A318Bdc1C9D0F",
    ABI: tractorNftContract.abi,
  },
  treeStakingContract: {
    address: "0x3077cE62839b65A2F0FDc00D5A7f70159F89F856",
    ABI: treeStakingContract.abi,
  },
  tractorStakingContract: {
    address: "0xdBc21cDF4283427F78fc296406d48f8822D14E4a",
    ABI: tractorStakingContract.abi,
  },
};
