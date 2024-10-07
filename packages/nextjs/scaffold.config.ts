import { env } from "./types/env";
import * as chains from "viem/chains";
import file from "~~/contracts-data/deployments/addresses.json";

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
};

const isProduction = env.NEXT_PUBLIC_VERCEL_ENV === "production" || env.NEXT_PUBLIC_VERCEL_ENV === "preview";

export const mapHardhatNetworkToViemChain = (network: string): chains.Chain => {
  switch (network) {
    case "arbitrumSepolia":
      return chains.arbitrumSepolia;
    case "optimismSepolia":
      return chains.optimismSepolia;
    case "polygonAmoy":
      return chains.polygonAmoy;
    case "avalancheFuji":
      return chains.avalancheFuji;
    case "spicy":
      return chains.spicy;
    case "morphHolesky":
      return chains.morphHolesky;
    case "zkSyncSepoliaTestnet":
      return chains.zkSyncSepoliaTestnet;
    case "arbitrum":
      return chains.arbitrum;
    case "polygon":
      return chains.polygon;
    default:
      console.log("Unsupported network", network);
      throw new Error(`Unsupported network ${network}`);
  }
}

export const mapViemChainToHardhatNetwork = (network: chains.Chain): string => {
  switch (network) {
    case chains.arbitrumSepolia:
      return "arbitrumSepolia";
    case chains.optimismSepolia:
      return "optimismSepolia";
    case chains.polygonAmoy:
      return "polygonAmoy";
    case chains.avalancheFuji:
      return "avalancheFuji";
    case chains.spicy:
      return "spicy";
    case chains.morphHolesky:
      return "morphHolesky";
    case chains.zkSyncSepoliaTestnet:
      return "zkSyncSepoliaTestnet";
    case chains.arbitrum:
      return "arbitrum";
    case chains.polygon:
      return "polygon";
    default:
      console.log("Unsupported network", network);
      throw new Error(`Unsupported network ${network}`);
  }
}


export const supportedNetworks = Object.keys(file).filter((network) => network !== "default").map(mapHardhatNetworkToViemChain);

// const targetNetworks = isProduction ? chains.hardhat : chains.optimismSepolia;
const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: supportedNetworks,

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect if you only target the local network (default is 4000)
  pollingInterval: 30000,

  // This is ours Alchemy's default API key.
  // You can get your own at https://dashboard.alchemyapi.io
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF",

  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: true,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
