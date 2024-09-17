// export const contractAddress = "0x07A1ffb5caE2850c1c76FD06b5038f97E44eE2E1";
// export const contractAddress = "0xCf04B3ad5A6c4410E2EB9b7E3a353B823869b7F0";

import landGameABI from "../../artifacts/contracts/LandGame.sol/LandGame.json";
import gmoveABI from "../../artifacts/contracts/GMOVE.sol/GMOVE.json";
import treeNftABI from "../../artifacts/contracts/TreeNFT.sol/TreeNFT.json";
import tractorNftABI from "../../artifacts/contracts/TractorNFT.sol/TractorNFT.json";
import treeStakingABI from "../../artifacts/contracts/TreeStaking.sol/TreeStaking.json";
import tractorStakingABI from "../../artifacts/contracts/TractorStaking.sol/TractorStaking.json";

export const CONTRACTS = {
  landGameContract: {
    address: "0xB9411caB8fC198c49d72137ffBc04A97ca70aF82",
    ABI: landGameABI.abi,
  },

  gmoveTokenContract: {
    address: "0x28a5e22F6772b919274C39301C2DfAFEC1F383e0",
    ABI: gmoveABI.abi,
  },
  treeNftContract: {
    address: "0xC6EcDC1ccCb408033bf0D5e7eC7Dc43297f09E25",
    ABI: treeNftABI.abi,
  },
  tractorNftContract: {
    address: "0x0e54626B24ECb6BA26d3640D4a1A318Bdc1C9D0F",
    ABI: tractorNftABI.abi,
  },
  treeStakingContract: {
    address: "0x3077cE62839b65A2F0FDc00D5A7f70159F89F856",
    ABI: treeStakingABI.abi,
  },
  tractorStakingContract: {
    address: "0xdBc21cDF4283427F78fc296406d48f8822D14E4a",
    ABI: tractorStakingABI.abi,
  },
};
