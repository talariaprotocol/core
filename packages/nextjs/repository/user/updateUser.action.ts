"use server";

import { UserTable } from "./user.table";
import { Insertable } from "kysely";
import { databaseService } from "~~/services/databaseService";

export async function updateUserAction({
  status,
  id,
 document,
}: Insertable<UserTable>) {
  return await databaseService.updateUser({
    id,
    status,
    document,
  });
}
