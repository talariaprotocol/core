"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AutoRedirect({ createdSlug, chainId }: { createdSlug: string; chainId: number }) {
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();

  useEffect(() => {
    if (countdown === 0) {
      router.push(`/whitelist/${chainId}/${createdSlug}`);
      return;
    }

    // Countdown logic
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000); // Update countdown every second

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, [countdown, router]);

  // Function to handle manual redirection via the clickable link
  const handleManualRedirect = () => {
    router.push(`/whitelist/${chainId}/${createdSlug}`);
  };

  return (
    <div className="mt-4">
      <p className="text-sm text-center">
        You will be redirected to your{" "}
        <Link href="#" onClick={handleManualRedirect} style={{ textDecoration: "underline", cursor: "pointer" }}>
          Whitelist
        </Link>{" "}
        page in {countdown}...
      </p>
    </div>
  );
}
