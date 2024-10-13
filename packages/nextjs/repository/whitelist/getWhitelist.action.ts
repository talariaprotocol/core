"use server";

import { databaseService } from "~~/services/databaseService";

export async function getWhitelistAction({ slug }: { slug: string }) {
  return await databaseService.getWhitelist({
    slug,
  });
}
