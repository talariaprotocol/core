"use server";
import {databaseService} from "~~/services/databaseService";

export async function createWhitelistAction(
    {
        logo,
        protocol_name,
        slug,
        wallet,
        whilist_address,
        protocolRedirect
    }: {
        logo: string;
        protocol_name: string;
        slug: string;
        wallet: string;
        whilist_address: string;
        protocolRedirect: string | undefined
    }) {
    return await databaseService.createWhitelist({
        logo,
        protocol_name,
        slug,
        wallet,
        whilist_address,
        protocolRedirect,
    });
}