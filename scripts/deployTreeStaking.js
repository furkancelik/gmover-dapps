const hre = require("hardhat");

async function main() {
  // Daha önce deploy edilen GMOVE ve TreeNFT kontrat adresleri
  const GMOVE_ADDRESS = "0x0148a67FB630c673684D0dF54Fbf31162B713934"; // GMOVE kontrat adresi
  // const TREE_NFT_ADDRESS = "0x93BFA423de1788ff5701c8341315fB8673B6B2a4"; // TreeNFT kontrat adresi
  const TREE_NFT_ADDRESS = "0xC0208b026D1fAc367413a94E5742656ed142BEaE"; // TreeNFT kontrat adresi
  // const LAND_GAME_ADDRESS = "0xc65f60B8b5E2523a6Ca41a449c71d6693e5D72FC"; // TreeNFT kontrat adresi
  const LAND_GAME_ADDRESS = "0x6A8ac6CF92e21946F2EC0B7A87a83568d771220D"; // TreeNFT kontrat adresi
  const REWARD_RATE = "10000000000000000000";

  // TreeStaking kontratını alıyoruz
  const TreeStaking = await hre.ethers.getContractFactory("TreeStaking");

  // TreeStaking kontratını deploy ediyoruz, TreeNFT ve GMOVE adreslerini constructor'a geçiyoruz
  const treeStaking = await TreeStaking.deploy(
    TREE_NFT_ADDRESS,
    GMOVE_ADDRESS,
    LAND_GAME_ADDRESS,
    REWARD_RATE
  );

  // Deployment işlemini bekliyoruz
  await treeStaking.waitForDeployment();

  console.log(`TreeStaking deployed to: ${treeStaking.target}`);
}

// Async/await kullanımına uygun yapı
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
