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

export const NumberContractAddress: Record<number, Address> = {
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.NumberContract as Address,
};

export const EarlyAccessCodeAddress: Record<number, Address> = {
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.EarlyAccessCodes as Address,
  [AvalancheFujiChainId]: DeployedAddresses.avalancheFuji.EarlyAccessCodes as Address,
  [zkSyncTestNetCode]: DeployedAddresses.zkSyncSepolia.EarlyAccessCodes as Address,
  [polygonTestnet]: DeployedAddresses.polygonAmoy.EarlyAccessCodes as Address,
  [ArbitrumSepoliaChainId]: DeployedAddresses.arbitrumSepolia.EarlyAccessCodes as Address,
  [MorphHoleskyChainId]: DeployedAddresses.morphHolesky.EarlyAccessCodes as Address,
  [KintoChainId]: DeployedAddresses.kinto.EarlyAccessCodes as Address,
};

export const EarlyAccesCodeTestAddress: Record<number, Address> = {
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.EarlyAccessCodesTestContract as Address,
  [AvalancheFujiChainId]: DeployedAddresses.avalancheFuji.EarlyAccessCodesTestContract as Address,
  [zkSyncTestNetCode]: DeployedAddresses.zkSyncSepolia.EarlyAccessCodesTestContract as Address,
  [polygonTestnet]: DeployedAddresses.polygonAmoy.EarlyAccessCodesTestContract as Address,
  [ArbitrumSepoliaChainId]: DeployedAddresses.arbitrumSepolia.EarlyAccessCodesTestContract as Address,
  [MorphHoleskyChainId]: DeployedAddresses.morphHolesky.EarlyAccessCodesTestContract as Address,
  [KintoChainId]: DeployedAddresses.kinto.EarlyAccessCodesTestContract as Address,
};

export const GiftCardAddress: Record<number, Address> = {
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.GiftCards as Address,
  [zkSyncTestNetCode]: DeployedAddresses.zkSyncSepolia.GiftCards as Address,
  [polygonTestnet]: DeployedAddresses.polygonAmoy.GiftCards as Address,
  [AvalancheFujiChainId]: DeployedAddresses.avalancheFuji.GiftCards as Address,
  [ArbitrumSepoliaChainId]: DeployedAddresses.arbitrumSepolia.GiftCards as Address,
  [ChillizChainId]: DeployedAddresses.chilizSpicy.GiftCards as Address,
  [MorphHoleskyChainId]: DeployedAddresses.morphHolesky.GiftCards as Address,
};

export const MorfiAddress: Record<number, Address> = {
  [zkSyncTestNetCode]: DeployedAddresses.zkSyncSepolia.MORFI as Address,
  [polygonTestnet]: DeployedAddresses.polygonAmoy.MORFI as Address,
  [AvalancheFujiChainId]: DeployedAddresses.avalancheFuji.MORFI as Address,
};

export const GiftcardTokenAddress: Record<number, Address> = {
  [ChillizChainId]: DeployedAddresses.chilizSpicy.BCN as Address,
  [ArbitrumSepoliaChainId]: DeployedAddresses.arbitrumSepolia.BCN as Address,
  [MorphHoleskyChainId]: DeployedAddresses.morphHolesky.BCN as Address,
};

export const WorldcoinValidatorModuleAddress: Record<number, Address> = {
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.WorldcoinValidatorModule as Address,
  [polygonTestnet]: DeployedAddresses.polygonAmoy.WorldcoinValidatorModule as Address,
};

export const AirNftContractAddress: Record<number, Address> = {
  [polygonTestnet]: DeployedAddresses.polygonAmoy.AlephNFT as Address,
};

export const AirNftDropperContractAddress: Record<number, Address> = {
  [polygonTestnet]: DeployedAddresses.polygonAmoy.AlephNFTAirdropper as Address,
};

export const WorldChampionNFTContractAddress: Record<number, Address> = {
  [KintoChainId]: DeployedAddresses.kinto.WorldChampionNFT as Address,
};

export const WorldChampionNFTAirdropperAddress: Record<number, Address> = {
  [KintoChainId]: DeployedAddresses.kinto.WorldChampionNFTAirdropper as Address,
};

export const layerZeroBridgeAddress: Record<number, Address> = {
  [OptimismSepoliaChainId]: DeployedAddresses.optimismSepolia.AddressFreeBridge as Address,
  [ArbitrumSepoliaChainId]: DeployedAddresses.arbitrumSepolia.AddressFreeBridge as Address,
};

export const MatchTicketERC1155Address: Record<number, Address> = {
  [ChillizChainId]: DeployedAddresses.chilizSpicy.MatchTicket as Address,
};

export const MatchTicketAirdropperAddress: Record<number, Address> = {
  [ChillizChainId]: DeployedAddresses.chilizSpicy.MatchTicketAirdropper as Address,
};
export const KintoCountryValidatorModuleAddress = DeployedAddresses.kinto.KintoCountryValidatorModule as Address;
