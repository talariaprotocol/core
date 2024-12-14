"use server";

import { UserTable } from "./user.table";
import { Insertable } from "kysely";
import { Address } from "viem";
import { databaseService } from "~~/services/databaseService";

export async function createUserAction({
  status,
  wallet,
  document,
}: Insertable<UserTable>) {
  return await databaseService.createUser({
    wallet,
    document,
  });
}
