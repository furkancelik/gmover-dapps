const hre = require("hardhat");

async function main() {
  const TRACTOR_STAKING_ADDRESS = "0xdBc21cDF4283427F78fc296406d48f8822D14E4a";
  const NEW_REWARD_RATE = "400000000000"; // Yeni ödül oranı (günlük ortalama 3-5 token için hesapladığımız değer)

  // Eğer 10 traktör stake edilmişse, günlük toplam ödül tam olarak 4 token olacak.
  // Eğer stake edilen traktör sayısı artarsa, toplam ödül miktarı da artacak, ancak traktör başına düşen ödül azalacak.
  // Eğer stake edilen traktör sayısı azalırsa, toplam ödül miktarı da azalacak, ancak traktör başına düşen ödül artacak.

  console.log("Setting new reward rate for TractorStaking contract...");

  // TractorStaking kontratının ABI'sini alıyoruz
  const TractorStaking = await hre.ethers.getContractFactory("TractorStaking");

  // Mevcut TractorStaking kontratına bağlanıyoruz
  const tractorStaking = TractorStaking.attach(TRACTOR_STAKING_ADDRESS);

  try {
    // setRewardRate fonksiyonunu çağırıyoruz
    const tx = await tractorStaking.setRewardRate(NEW_REWARD_RATE);
    console.log("Transaction sent. Waiting for confirmation...");

    // İşlemin onaylanmasını bekliyoruz
    await tx.wait();

    console.log(
      `New reward rate set successfully. Transaction hash: ${tx.hash}`
    );

    // Yeni ödül oranını kontrol ediyoruz
    const updatedRewardRate = await tractorStaking.rewardRate();
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
