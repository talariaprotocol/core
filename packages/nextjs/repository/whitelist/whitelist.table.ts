import { Generated } from 'kysely';

export interface WhitelistTable {
    created_at: Generated<Date>;
    id: Generated<number>;
    logo: string;
    protocol_name: string;
    slug: string;
    wallet: string;
    whilist_address: string;
    protocolRedirect: string;
}
