// src/chains/movement.js

export const movementChain = {
  id: 0x780c, // Hexadecimal olarak 0x780c, decimal olarak 30732
  name: "Movement EVM",
  network: "movement",
  nativeCurrency: {
    decimals: 18,
    name: "MOVE",
    symbol: "MOVE",
  },
  rpcUrls: {
    default: {
      http: ["https://mevm.devnet.imola.movementlabs.xyz"],
    },
    public: {
      http: ["https://mevm.devnet.imola.movementlabs.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Movement Explorer",
      url: "https://explorer.devnet.imola.movementlabs.xyz",
    },
  },
  testnet: true, // Eğer testnet ise true, mainnet ise false
};
