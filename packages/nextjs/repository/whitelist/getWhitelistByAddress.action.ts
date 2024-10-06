"use server";

import { Address } from "viem";
import { databaseService } from "~~/services/databaseService";

export async function getWhitelistByAddressAction({ address }: { address: Address }) {
  return await databaseService.getWhitelistByAddress({
    whitelist_address: address,
  });
}
