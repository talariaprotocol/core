import { Address } from "viem";
import { CreateWhitelist } from "~~/types/whitelist";

class DatabaseService {
  constructor() {}

  async createWhitelist({ address, name, slug, image, productUrl }: CreateWhitelist) {
    // TODO: Post to DB
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

export const databaseService = new DatabaseService();
