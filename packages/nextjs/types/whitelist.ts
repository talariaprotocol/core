import { Address } from "viem";

export interface MinimalWhitelist {
  address: Address;
  owner: Address;
}

export interface WhitelistedAddresses {
  address: Address;
  timestamp: bigint;
}
[];

export interface WhitelistStatistics {
  generated: number;
  whitelistedAddresses: WhitelistedAddresses[];
}
