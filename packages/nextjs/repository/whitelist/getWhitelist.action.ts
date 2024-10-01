"use server";
import {databaseService} from "~~/services/databaseService";

export async function getWhitelistAction(
    {
        wallet
    }: {
        wallet: string;
    }) {
    return await databaseService.getWhitelist({
        wallet,
    });
}