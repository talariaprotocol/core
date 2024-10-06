"use server";

import { WhitelistTable } from "./whitelist.table";
import { Insertable } from "kysely";
import { databaseService } from "~~/services/databaseService";

export async function createWhitelistAction({
  logo,
  protocol_name,
  slug,
  owner,
  whitelist_address,
  protocolRedirect,
}: Insertable<WhitelistTable>) {
  return await databaseService.createWhitelist({
    logo,
    protocol_name,
    slug,
    owner,
    whitelist_address,
    protocolRedirect,
  });
}
