const hre = require("hardhat");

async function main() {
  // Daha önce deploy edilen GMOVE ve TreeNFT kontrat adresleri
  const GMOVE_ADDRESS = "0x0148a67FB630c673684D0dF54Fbf31162B713934"; // GMOVE kontrat adresi
  // const TRACTOR_NFT_ADDRESS = "0x93BFA423de1788ff5701c8341315fB8673B6B2a4"; // TreeNFT kontrat adresi
  const TRACTOR_NFT_ADDRESS = "0x17361F15F23309a1362d1D5b5Ec3D537b0262Bb2"; // TreeNFT kontrat adresi
  // const LAND_GAME_ADDRESS = "0xc65f60B8b5E2523a6Ca41a449c71d6693e5D72FC"; // TreeNFT kontrat adresi
  const LAND_GAME_ADDRESS = "0x6A8ac6CF92e21946F2EC0B7A87a83568d771220D"; // TreeNFT kontrat adresi
  const REWARD_RATE = "10000000000000000000000";

  // TractorStaking kontratını alıyoruz
  const TractorStaking = await hre.ethers.getContractFactory("TractorStaking");

  // TractorStaking kontratını deploy ediyoruz, TreeNFT ve GMOVE adreslerini constructor'a geçiyoruz
  const tractorStaking = await TractorStaking.deploy(
    TRACTOR_NFT_ADDRESS,
    GMOVE_ADDRESS,
    LAND_GAME_ADDRESS,
    REWARD_RATE
  );

  // Deployment işlemini bekliyoruz
  await tractorStaking.waitForDeployment();

  console.log(`TractorStaking deployed to: ${tractorStaking.target}`);
}

// Async/await kullanımına uygun yapı
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
