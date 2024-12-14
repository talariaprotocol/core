"use client";

import React from "react";
import { useEffect, useState } from "react";
import AuthUpdater from "./auth-updater";
import Footer from "./footer";
import { Navigation } from "./navigation";
import { Toaster } from "./ui/toaster";
import { TooltipProvider } from "./ui/tooltip";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { WagmiProvider } from "wagmi";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { UserProvider } from "~~/context";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <UserProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ProgressBar />
          <RainbowKitProvider
            avatar={BlockieAvatar}
            theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
          >
            <div className="flex flex-col min-h-screen">
              <TooltipProvider>
                <Navigation />
                <main className="flex-1 flex justify-center bg-background py-8 px-2 md:px-20 mt-20">
                  {children}
                  <AuthUpdater />
                  <Toaster />
                </main>
                <Footer />
              </TooltipProvider>
            </div>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </UserProvider>
  );
};
