export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:" + process.env.PORT;

// Url that includes this slug, will not display connect button
export const CUSTOM_WALLET_PAGES = ["kinto"];

export const KINTO_BASE_URL = `dev.kinto.xyz:${process.env.PORT}`;
