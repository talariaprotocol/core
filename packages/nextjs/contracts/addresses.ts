import DeployedAddresses from "../contracts-data/deployments/addresses.json";
import { Address } from "viem";
import { mapViemChainToHardhatNetwork, supportedNetworks } from "~~/scaffold.config";

export const ChillizChainId = 88882;
export const OptimismSepoliaChainId = 11155420;
export const zkSyncTestNetCode = 300;
export const polygonTestnet = 80001;
export const AvalancheFujiChainId = 43113;
export const ArbitrumSepoliaChainId = 421614;
export const KintoChainId = 7887;
export const MorphHoleskyChainId = 2810;

// @todo separate test and mainnet addresses -> test at testnet.app.talariaprotocol.xyz
export const WhitelistFactoryAddresses: Record<number, Address> = {
  ...supportedNetworks
    .map(network => {
      const hardhatNetwork = mapViemChainToHardhatNetwork(network);

      if (hardhatNetwork in DeployedAddresses)
        return {
          [network.id]: DeployedAddresses[hardhatNetwork as keyof typeof DeployedAddresses].WhitelistFactory as Address,
        };
      return {};
    })
    .reduce((acc, val) => ({ ...acc, ...val }), {}),
};
