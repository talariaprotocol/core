import { createKysely } from "@vercel/postgres-kysely";
import { Insertable, Kysely, sql } from "kysely";
import { WhitelistTable } from "~~/repository/whitelist/whitelist.table";

interface Database {
  whitelist: WhitelistTable;
}

class DatabaseService {
  private db: Kysely<Database>;
  constructor() {
    this.db = createKysely<Database>({
      connectionString: process.env.POSTGRES_URL,
    });
    this.createTableIfNotExists();
  }

  private async createTableIfNotExists() {
    await this.db.schema
      .createTable("whitelist")
      .ifNotExists()
      .addColumn("id", "serial", col => col.primaryKey())
      .addColumn("created_at", sql`timestamp with time zone`, cb => cb.defaultTo(sql`current_timestamp`))
      .addColumn("logo", "varchar")
      .addColumn("protocol_name", "varchar")
      .addColumn("slug", "varchar", col => col.unique())
      .addColumn("owner", "varchar", col => col.notNull())
      .addColumn("whitelist_address", "varchar", col => col.notNull())
      .addColumn("protocolRedirect", "varchar")
      .execute();
  }

  async createWhitelist({
    logo,
    protocol_name,
    slug,
    owner,
    whitelist_address,
    protocolRedirect,
  }: Insertable<WhitelistTable>) {
    // Insert the whitelist data into the database, omitting id and created_at
    await this.db
      .insertInto("whitelist")
      .values({
        logo: logo,
        protocol_name: protocol_name,
        slug: slug,
        owner: owner,
        whitelist_address: whitelist_address,
        protocolRedirect: protocolRedirect,
      })
      .execute();
  }
  async getWhitelist({ slug }: Pick<WhitelistTable, "slug">) {
    // Fetch the whitelist data where the wallet matches the provided value
    const result = await this.db.selectFrom("whitelist").selectAll().where("slug", "=", slug).executeTakeFirst();
    // Return the result (it will be an array, so handle it accordingly)
    return result;
  }

  // TODO: Send also chain id when added to whitelsit table
  async getWhitelistByAddress({ whitelist_address }: Pick<WhitelistTable, "whitelist_address">) {
    const result = await this.db
      .selectFrom("whitelist")
      .selectAll()
      .where("whitelist_address", "=", whitelist_address)
      .executeTakeFirst();
    return result;
  }
}

export const databaseService = new DatabaseService();
