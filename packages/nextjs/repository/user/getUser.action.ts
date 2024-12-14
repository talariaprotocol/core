"use server";

import { databaseService } from "~~/services/databaseService";

export async function getUserAction({ wallet }: { wallet: string }) {
  return await databaseService.getUser({
    wallet,
  });
}
