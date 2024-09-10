const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners(); // Token sahibini (deploy eden cüzdan) alıyoruz
  console.log("Distributing tokens from address:", deployer.address);

  const GMOVE = await hre.ethers.getContractFactory("GMOVE");
  const gmove = await GMOVE.attach(
    "0x4586a2FA371d8cbD562947C85E90d00aF232FCBF"
  ); // Kontratın deploy edildiği adresi girin

  console.log(gmove);
  const recipients = [
    "0x3FB4C0891bb93430af6D7Fd38bf6639cf201c3Df",
    // "0x1f7e38987f5163C90Ac848976f930158c71C4068", // İlk alıcı adresi
    // "0x71A57f997Ee35638fd8aEe8253272Dbb3ae7e7bd", // İkinci alıcı adresi
    // "0xacfcd6409c6fbE7DD04Fb185072e2595E9C57C73", // Üçüncü alıcı adresi
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
