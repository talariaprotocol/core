"use server";

import { Address } from "viem";
import { databaseService } from "~~/services/databaseService";

export async function getWhitelistsByOwner({ owner }: { owner: Address }) {
  return await databaseService.getWhitelistsByOwner({
    owner: owner.toLowerCase() as Address,
  });
}
