const hre = require("hardhat");

async function main() {
  // GMOVE kontratını alıyoruz
  const GMOVE_ADDRESS = "0x4586a2FA371d8cbD562947C85E90d00aF232FCBF"; // Daha önce deploy edilen GMOVE kontrat adresi

  const TractorNFT = await hre.ethers.getContractFactory("TractorNFT");

  // TractorNFT kontratını deploy ediyoruz, GMOVE adresini constructor'a geçiyoruz
  const tractorNFT = await TractorNFT.deploy(GMOVE_ADDRESS);

  // Deployment işlemini bekliyoruz
  await tractorNFT.waitForDeployment();

  console.log(`TractorNFT deployed to: ${tractorNFT.target}`);
}

// Async/await kullanımına uygun yapı
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
