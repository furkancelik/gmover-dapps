const hre = require("hardhat");

async function main() {
  // GMOVE kontratını alıyoruz
  const GMOVE_ADDRESS = "0x4586a2FA371d8cbD562947C85E90d00aF232FCBF"; // Daha önce deploy edilen GMOVE kontrat adresi

  const TreeNFT = await hre.ethers.getContractFactory("TreeNFT");

  // TreeNFT kontratını deploy ediyoruz, GMOVE adresini constructor'a geçiyoruz
  const treeNFT = await TreeNFT.deploy(GMOVE_ADDRESS);

  // Deployment işlemini bekliyoruz
  await treeNFT.waitForDeployment();

  console.log(`TreeNFT deployed to: ${treeNFT.target}`);
}

// Async/await kullanımına uygun yapı
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
