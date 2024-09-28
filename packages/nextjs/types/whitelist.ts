import { Address } from "viem";

export interface CreateWhitelist {
  address: Address;
  name: string;
  slug: string;
  image: File;
  productUrl: string;
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
