export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:" + process.env.PORT;
