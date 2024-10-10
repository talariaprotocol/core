import {
  ArbitrumSepoliaChainId,
  AvalancheFujiChainId,
  ChillizChainId,
  KintoChainId,
  OptimismSepoliaChainId,
  polygonAmoyTestnet,
  zkSyncTestNetCode,
    MorphHoleskyChainId
} from "~~/contracts/addresses";

export const TransactionExplorerBaseUrl: Record<number, string> = {
  [OptimismSepoliaChainId]: "https://optimism-sepolia.blockscout.com/tx/",
  [zkSyncTestNetCode]: "https://sepolia-era.zksync.network/tx/",
  [polygonAmoyTestnet]: "https://amoy.polygonscan.com/tx/",
  [AvalancheFujiChainId]: "https://testnet.snowtrace.io/tx/",
  [ArbitrumSepoliaChainId]: "https://arbitrum-sepolia.blockscout.com/tx/",
  [KintoChainId]: "https://kintoscan.io/tx/",
  [ChillizChainId]: "https://testnet.chiliscan.com/tx/",
  [MorphHoleskyChainId]: "\thttps://explorer-holesky.morphl2.io/tx/"
};

export const AddressExplorerBaseUrl: Record<number, string> = {
  [polygonAmoyTestnet]: "https://amoy.polygonscan.com/address/",
  [ArbitrumSepoliaChainId]: "https://arbitrum-sepolia.blockscout.com/address/",

}
