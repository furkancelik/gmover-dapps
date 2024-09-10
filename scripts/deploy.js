const hre = require("hardhat");

async function main() {
  const initialSupply = hre.ethers.parseUnits("10000000000", 18); // 1 milyon token, 18 ondalık basamak ile
  const TRACTOR_NFT_REWARD_RATE = "10000000000000000000000";
  const TREE_NFT_REWARD_RATE = "10000000000000000000";

  const GMOVE = await hre.ethers.getContractFactory("GMOVE");
  const gmove = await GMOVE.deploy(initialSupply);
  await gmove.waitForDeployment();
  const GMOVE_ADDRESS = gmove.target;

  const LandGame = await hre.ethers.getContractFactory("LandGame");
  const landGame = await LandGame.deploy(GMOVE_ADDRESS);
  await landGame.waitForDeployment();
  const LAND_GAME_ADDRESS = landGame.target;

  const TractorNFT = await hre.ethers.getContractFactory("TractorNFT");
  const tractorNFT = await TractorNFT.deploy(GMOVE_ADDRESS);
  await tractorNFT.waitForDeployment();
  const TRACTOR_NFT_ADDRESS = tractorNFT.target;

  const TreeNFT = await hre.ethers.getContractFactory("TreeNFT");
  const treeNFT = await TreeNFT.deploy(GMOVE_ADDRESS);
  await treeNFT.waitForDeployment();
  const TREE_NFT_ADDRESS = treeNFT.target;

  // TractorStaking kontratını alıyoruz
  const TractorStaking = await hre.ethers.getContractFactory("TractorStaking");

  // TractorStaking kontratını deploy ediyoruz, TreeNFT ve GMOVE adreslerini constructor'a geçiyoruz
  const tractorStaking = await TractorStaking.deploy(
    TRACTOR_NFT_ADDRESS,
    GMOVE_ADDRESS,
    LAND_GAME_ADDRESS,
    TRACTOR_NFT_REWARD_RATE
  );

  // Deployment işlemini bekliyoruz
  await tractorStaking.waitForDeployment();
  const TRACTOR_STAKING_ADDRESS = tractorStaking.target;

  // TreeStaking kontratını alıyoruz
  const TreeStaking = await hre.ethers.getContractFactory("TreeStaking");

  // TreeStaking kontratını deploy ediyoruz, TreeNFT ve GMOVE adreslerini constructor'a geçiyoruz
  const treeStaking = await TreeStaking.deploy(
    TREE_NFT_ADDRESS,
    GMOVE_ADDRESS,
    LAND_GAME_ADDRESS,
    TREE_NFT_REWARD_RATE
  );

  // Deployment işlemini bekliyoruz
  await treeStaking.waitForDeployment();
  const TREE_STAKING_ADDRESS = treeStaking.target;

  console.log(
    "------------------------=CONTRACT LIST=------------------------"
  );
  console.log("LAND_GAME_ADDRESS:", LAND_GAME_ADDRESS);
  console.log("GMOVE_ADDRESS:", GMOVE_ADDRESS);
  console.log("TRACTOR_NFT_ADDRESS:", TRACTOR_NFT_ADDRESS);
  console.log("TREE_NFT_ADDRESS:", TREE_NFT_ADDRESS);
  console.log("TREE_STAKING_ADDRESS:", TREE_STAKING_ADDRESS);
  console.log("TRACTOR_STAKING_ADDRESS:", TRACTOR_STAKING_ADDRESS);
  console.log(
    "---------------------------------------------------------------"
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
