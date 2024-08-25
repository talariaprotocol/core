import DeployedAddresses from "../contracts-data/deployments/addresses.json";
import { Address } from "viem";

export const OptimismSepoliaChainId = 11155420;
export const zkSyncTestNetCode = 300;

export const NumberContractAddress: Record<number, Address> = {
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.NumberContract as Address,
};

export const GiftCardAddress: Record<number, Address> = {
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.GiftCards as Address,
  [zkSyncTestNetCode]: DeployedAddresses.zkSyncSepolia.GiftCards as Address,
};

export const MorfiAddress: Record<number, Address> = {
  [zkSyncTestNetCode]: DeployedAddresses.zkSyncSepolia.MORFI as Address,
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.MORFI as Address,
};

export const WorldcoinValidatorModuleAddress: Record<number, Address> = {
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.WorldcoinValidatorModule as Address,
};
