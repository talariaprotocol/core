"use client";

// Required for Next.js
import { ReactNode, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const minikit = MiniKit.install();
    console.log("Installing minikit... ", minikit);
  }, []);

  return <>{children}</>;
}
