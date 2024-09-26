import DeployedAddresses from "../contracts-data/deployments/addresses.json";
import { Address } from "viem";

export const ChillizChainId = 88882;
export const OptimismSepoliaChainId = 11155420;
export const zkSyncTestNetCode = 300;
export const polygonTestnet = 80001;
export const AvalancheFujiChainId = 43113;
export const ArbitrumSepoliaChainId = 421614;
export const KintoChainId = 7887;
export const MorphHoleskyChainId = 2810;

export const WhitelistFactoryAddresses: Record<number, Address> = {
  [ArbitrumSepoliaChainId]: DeployedAddresses.arbitrumSepolia.WhitelistFactory as Address,
};
