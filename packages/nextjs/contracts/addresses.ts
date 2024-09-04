import DeployedAddresses from "../contracts-data/deployments/addresses.json";
import { Address } from "viem";

export const OptimismSepoliaChainId = 11155420;
export const zkSyncTestNetCode = 300;
export const polygonTestnet = 80001;
export const AvalancheFujiChainId = 43113;
export const ArbitrumSepoliaChainId = 421614;

export const NumberContractAddress: Record<number, Address> = {
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.NumberContract as Address,
};

export const EarlyAccessCodeAddress: Record<number, Address> = {
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.EarlyAccessCodes as Address,
  [AvalancheFujiChainId]: DeployedAddresses.avalancheFuji.EarlyAccessCodes as Address,
  [zkSyncTestNetCode]: DeployedAddresses.zkSyncSepolia.EarlyAccessCodes as Address,
  [polygonTestnet]: DeployedAddresses.polygonAmoy.EarlyAccessCodes as Address,
  [ArbitrumSepoliaChainId]: DeployedAddresses.arbitrumSepolia.EarlyAccessCodes as Address,
};

export const EarlyAccesCodeTestAddress: Record<number, Address> = {
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.EarlyAccessCodesTestContract as Address,
  [AvalancheFujiChainId]: DeployedAddresses.avalancheFuji.EarlyAccessCodesTestContract as Address,
  [zkSyncTestNetCode]: DeployedAddresses.zkSyncSepolia.EarlyAccessCodesTestContract as Address,
  [polygonTestnet]: DeployedAddresses.polygonAmoy.EarlyAccessCodesTestContract as Address,
  [ArbitrumSepoliaChainId]: DeployedAddresses.arbitrumSepolia.EarlyAccessCodesTestContract as Address,
};

export const GiftCardAddress: Record<number, Address> = {
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.GiftCards as Address,
  [zkSyncTestNetCode]: DeployedAddresses.zkSyncSepolia.GiftCards as Address,
  [polygonTestnet]: DeployedAddresses.polygonAmoy.GiftCards as Address,
  [AvalancheFujiChainId]: DeployedAddresses.avalancheFuji.GiftCards as Address,
  [ArbitrumSepoliaChainId]: DeployedAddresses.arbitrumSepolia.GiftCards as Address,
};

export const MorfiAddress: Record<number, Address> = {
  [zkSyncTestNetCode]: DeployedAddresses.zkSyncSepolia.MORFI as Address,
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.MORFI as Address,
  [polygonTestnet]: DeployedAddresses.polygonAmoy.MORFI as Address,
  [AvalancheFujiChainId]: DeployedAddresses.avalancheFuji.MORFI as Address,
  [ArbitrumSepoliaChainId]: DeployedAddresses.arbitrumSepolia.MORFI as Address,
};

export const WorldcoinValidatorModuleAddress: Record<number, Address> = {
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.WorldcoinValidatorModule as Address,
};

export const AirNftContractAddress: Record<number, Address> = {
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.AlephNFT as Address,
  [polygonTestnet]: DeployedAddresses.polygonAmoy.AlephNFT as Address,
};

export const AirNftDropperContractAddress: Record<number, Address> = {
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.AlephNFTAirdropper as Address,
  [polygonTestnet]: DeployedAddresses.polygonAmoy.AlephNFTAirdropper as Address,
};
