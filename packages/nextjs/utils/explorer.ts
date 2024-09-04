import {
  ArbitrumSepoliaChainId,
  AvalancheFujiChainId,
  KintoChainId,
  OptimismSepoliaChainId,
  polygonTestnet,
  zkSyncTestNetCode,
} from "~~/contracts/addresses";

export const TransactionExplorerBaseUrl: Record<number, string> = {
  [OptimismSepoliaChainId]: "https://optimism-sepolia.blockscout.com/tx/",
  [zkSyncTestNetCode]: "https://sepolia-era.zksync.network/tx/",
  [polygonTestnet]: "https://amoy.polygonscan.com/tx/",
  [AvalancheFujiChainId]: "https://testnet.snowtrace.io/tx/",
  [ArbitrumSepoliaChainId]: "https://arbitrum-sepolia.blockscout.com/tx/",
  [KintoChainId]: "https://kintoscan.io/tx/",
};
