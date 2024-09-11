const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners(); // Token sahibini (deploy eden cüzdan) alıyoruz
  console.log("Distributing tokens from address:", deployer.address);

  const GMOVE = await hre.ethers.getContractFactory("GMOVE");
  const gmove = await GMOVE.attach(
    "0xc30682F61f7b669aca86Be2a7Ff7a456a8b20Deb"
  ); // Kontratın deploy edildiği adresi girin

  console.log(gmove);
  const recipients = [
    "0x0F66A1C3a0cCDa981CbBA405582036c0655Fe146", //Land Game => 10k*1000
    "0x63Fc030CbbAc3bC7B4859402F8E35AB53C0d3522", //TreeStaking =>
    "0x6a7721e83B5829D09F6eAAf02BAd080779f5E2fF", //TracktorStaking
  ];

  const amount = hre.ethers.parseUnits("5000000", 18); // Her cüzdana göndereceğiniz token miktarı (örneğin, 100 GMOVE)

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    const tx = await gmove.transfer(recipient, amount);
    console.log(`Sent 100 GMOVE to ${recipient}. Transaction: ${tx.hash}`);
    await tx.wait(); // İşlemin onaylanmasını bekliyoruz
  }

  console.log("Token distribution complete.");
}

// Async/await yapılandırması
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
