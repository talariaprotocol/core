import { Generated } from 'kysely';

export interface UserTable {
    created_at: Generated<Date>;
    id: Generated<number>;
    wallet?: string;
    document?: string;
    status?: string;
}
