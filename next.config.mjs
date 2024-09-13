/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "discord.js": false,
      };
    }
    return config;
  },
  env: {
    DEFAULT_NETWORK: "0x780c", // Movement EVM ağının chain ID'si

    // // Movement EVM ağı için yapılandırma
    networkParams: {
      chainId: "0x780c", // Movement EVM ağı için hexadecimal chain ID (0x1a4 = 420)
      chainName: "Movement EVM",
      nativeCurrency: {
        name: "MOVE",
        symbol: "MOVE",
        decimals: 18,
      },
      rpcUrls: ["https://mevm.devnet.imola.movementlabs.xyz"], // Movement EVM için RPC URL'si
      blockExplorerUrls: ["https://explorer.devnet.imola.movementlabs.xyz"], // Eğer bir block explorer kullanıyorsanız buraya ekleyebilirsiniz
    },
    // Movement EVM ağı için yapılandırma
    // networkParams: {
    //   chainId: "0x539", // Movement EVM ağı için hexadecimal chain ID (0x1a4 = 420)
    //   chainName: "Movement Ganache",
    //   nativeCurrency: {
    //     name: "Ether",
    //     symbol: "ETH",
    //     decimals: 18,
    //   },
    //   rpcUrls: ["HTTP://127.0.0.1:7545"], // Movement EVM için RPC URL'si
    //   blockExplorerUrls: [""], // Eğer bir block explorer kullanıyorsanız buraya ekleyebilirsiniz
    // },
  },
};

export default nextConfig;
