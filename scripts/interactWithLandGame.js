const hre = require("hardhat");

async function main() {
  const LAND_GAME_ADDRESS = "0xB9411caB8fC198c49d72137ffBc04A97ca70aF82"; // LandGame kontrat adresi

  console.log("Interacting with LandGame contract...");

  // LandGame kontratının ABI'sini alıyoruz
  const LandGame = await hre.ethers.getContractFactory("LandGame");

  // Mevcut LandGame kontratına bağlanıyoruz
  const landGame = LandGame.attach(LAND_GAME_ADDRESS);

  try {
    // 1. Resource Claim Interval'ı al
    const currentInterval = await landGame.RESOURCE_CLAIM_INTERVAL();
    console.log(`Current Resource Claim Interval: ${currentInterval} seconds`);

    // 2. Resource Claim Interval'ı güncelle
    const newInterval = 86400; // 1 gün
    await landGame.setResourceClaimInterval(newInterval);
    console.log(`Resource Claim Interval updated to ${newInterval} seconds`);
  } catch (error) {
    console.error("Error interacting with LandGame contract:", error);
    process.exitCode = 1;
  }
}

// Async/await yapılandırması
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
