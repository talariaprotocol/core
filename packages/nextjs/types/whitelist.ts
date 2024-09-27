import { Address } from "viem";

export interface CreateWhitelist {
  address: Address;
  name: string;
  slug: string;
  image: File;
  productUrl: string;
}
