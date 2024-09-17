const hre = require("hardhat");

async function main() {
  const TREE_STAKING_ADDRESS = "0x3077cE62839b65A2F0FDc00D5A7f70159F89F856";
  const NEW_REWARD_RATE = "10000000000000000"; // Yeni ödül oranı (günlük ortalama 3-5 token için hesapladığımız değer)

  console.log("Setting new reward rate for TreeStaking contract...");

  // TreeStaking kontratının ABI'sini alıyoruz
  const TreeStaking = await hre.ethers.getContractFactory("TreeStaking");

  // Mevcut TreeStaking kontratına bağlanıyoruz
  const treeStaking = TreeStaking.attach(TREE_STAKING_ADDRESS);

  try {
    // setRewardRate fonksiyonunu çağırıyoruz
    const tx = await treeStaking.setRewardRate(NEW_REWARD_RATE);
    console.log("Transaction sent. Waiting for confirmation...");

    // İşlemin onaylanmasını bekliyoruz
    await tx.wait();

    console.log(
      `New reward rate set successfully. Transaction hash: ${tx.hash}`
    );

    // Yeni ödül oranını kontrol ediyoruz
    const updatedRewardRate = await treeStaking.rewardRate();
    console.log(`Updated reward rate: ${updatedRewardRate.toString()}`);
  } catch (error) {
    console.error("Error setting new reward rate:", error);
    process.exitCode = 1;
  }
}

// Async/await yapılandırması
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
