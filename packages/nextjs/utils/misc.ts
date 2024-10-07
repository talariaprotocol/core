import { env } from "~~/types/env";

export const host =
  env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https://commitprotocol.vercel.app"
    : env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? (env.NEXT_PUBLIC_VERCEL_BRANCH_URL ? "https://" + env.NEXT_PUBLIC_VERCEL_BRANCH_URL : undefined) ||
        "https://test-commitprotocol.vercel.app"
      : "https://test-commitprotocol.vercel.app";

export const walletSubstring = (address: string) =>
  address?.substring(0, 6) + "..." + address.substring(address.length - 4, address.length);
