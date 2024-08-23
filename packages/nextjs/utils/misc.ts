import { env } from "~~/types/env";

export const host =
  env.NEXT_PUBLIC_VERCEL_ENV === "production" || env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? "https://commit.vercel.app"
    : "http://localhost:3000";
