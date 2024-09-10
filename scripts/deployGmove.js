const hre = require("hardhat");

async function main() {
  // GMOVE kontratını alıyoruz
  const GMOVE = await hre.ethers.getContractFactory("GMOVE");

  // Başlangıç arzını belirliyoruz, örneğin 1 milyon token
  const initialSupply = hre.ethers.parseUnits("1000000", 18); // 1 milyon token, 18 ondalık basamak ile

  // GMOVE kontratını deploy ediyoruz
  const gmove = await GMOVE.deploy(initialSupply);

  // Deployment işlemini bekliyoruz
  await gmove.waitForDeployment();

  // Deployment adresini yazdırıyoruz
  console.log(`GMOVE deployed to: ${gmove.target}`);
}

// Async/await kullanımına uygun yapı
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
