"use server";

import { Address } from "viem";
import { databaseService } from "~~/services/databaseService";

export async function getWhitelistByAddressAction({ address, chain_id }: { address: Address; chain_id: number }) {
  return await databaseService.getWhitelistByAddress({
    whitelist_address: address,
    chain_id,
  });
}
