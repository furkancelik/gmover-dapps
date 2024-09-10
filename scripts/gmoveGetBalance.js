const hre = require("hardhat");

async function main() {
  const GMOVE = await hre.ethers.getContractFactory("GMOVE");
  const gmove = await GMOVE.attach(
    "0x4586a2FA371d8cbD562947C85E90d00aF232FCBF"
  ); // GMOVE kontrat adresi

  const recipients = [
    "0x3538721c5b90be6Bef0D3Ec738cA46f469Bcb9a9", // İlk alıcı adresi
    "0x3FB4C0891bb93430af6D7Fd38bf6639cf201c3Df",
  ];

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    const balance = await gmove.balanceOf(recipient); // balanceOf ile bakiyeyi sorguluyoruz
    console.log(
      `Address ${recipient} balance: ${hre.ethers.formatUnits(
        balance,
        18
      )} GMOVE`
    );
  }
}

// Async/await yapılandırması
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
