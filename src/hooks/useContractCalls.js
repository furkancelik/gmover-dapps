"use client";

import { useEthereum } from "@/context/EthereumContext";
import { ethers } from "ethers";
import { toast } from "react-toastify";

export function useContractCalls() {
  const { safeContract, userAddress } = useEthereum();

  async function getBalanceGMOVE() {
    console.log("getBalanceGMOVE");
    try {
      // userAddress'in tanımlı olup olmadığını kontrol et
      if (!userAddress) {
        throw new Error("User address is not available.");
      }

      // GMOVE token kontratının mevcut olup olmadığını kontrol et
      const balance = await safeContract("gmoveTokenContract", "balanceOf", [
        userAddress,
      ]);
      console.log("balance::balance:", balance);

      // Gelen balance değerini ether formatına çevir ve sonucu göster
      const formattedBalance = parseFloat(ethers.formatEther(balance)).toFixed(
        2
      );
      console.log("BALANCE:", formattedBalance);
      setPara(formattedBalance); // Eğer setPara fonksiyonu başka bir yerden geliyorsa kontrol et
    } catch (error) {
      console.error("Error fetching GMOVE balance:", error);
    }
  }

  return { getBalanceGMOVE };
}
