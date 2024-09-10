const hre = require("hardhat");

async function main() {
  const GMOVE_TOKEN_ADDRESS = "0x..."; // GMOVE token kontrat adresi

  const LandGame = await hre.ethers.getContractFactory("LandGame");
  const landGame = await LandGame.deploy(GMOVE_TOKEN_ADDRESS);

  await landGame.waitForDeployment();

  console.log(`Lock with deployed to ${landGame.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
