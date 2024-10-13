"use server";

import { WhitelistTable } from "./whitelist.table";
import { Insertable } from "kysely";
import { Address } from "viem";
import { databaseService } from "~~/services/databaseService";

export async function createWhitelistAction({
  logo,
  protocol_name,
  slug,
  owner,
  chain_id,
  whitelist_address,
  protocolRedirect,
}: Insertable<WhitelistTable>) {
  return await databaseService.createWhitelist({
    logo,
    protocol_name,
    slug,
    owner: owner.toLowerCase() as Address,
    chain_id,
    whitelist_address: whitelist_address.toLowerCase() as Address,
    protocolRedirect,
  });
}
