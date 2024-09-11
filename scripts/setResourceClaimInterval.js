const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(
    "Updating Resource Claim Interval from address:",
    deployer.address
  );

  // LandGame kontratının ABI'sini ve adresini tanımlayın
  const LandGame = await hre.ethers.getContractFactory("LandGame");
  const landGameAddress = "0x0F66A1C3a0cCDa981CbBA405582036c0655Fe146"; // LandGame kontratının deploy edildiği adresi girin
  const landGame = LandGame.attach(landGameAddress);

  // Yeni Resource Claim Interval değerini belirleyin (örneğin 20 saniye)
  const newInterval = 86400;

  try {
    // setResourceClaimInterval fonksiyonunu çağırın
    const tx = await landGame.setResourceClaimInterval(newInterval);
    console.log(
      `Setting Resource Claim Interval to ${newInterval} seconds. Transaction hash: ${tx.hash}`
    );

    // İşlemin onaylanmasını bekleyin
    await tx.wait();
    console.log(
      "Transaction confirmed. Resource Claim Interval updated successfully."
    );

    // Yeni değeri kontrol edin
    const updatedInterval = await landGame.RESOURCE_CLAIM_INTERVAL();
    console.log(`New Resource Claim Interval: ${updatedInterval} seconds`);
  } catch (error) {
    console.error("Error updating Resource Claim Interval:", error);
  }
}

// Async/await yapılandırması
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
