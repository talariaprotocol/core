import { Generated } from 'kysely';
import { Address } from 'viem';

export interface WhitelistTable {
    created_at: Generated<Date>;
    id: Generated<number>;
    logo?: string;
    protocol_name?: string;
    slug?: string;
    owner: Address;
    whitelist_address: Address;
    protocolRedirect?: string;
}
