import React, { Dispatch, SetStateAction, useMemo } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { useRole } from "./ScaffoldEthAppWithProviders";
import { ToastProvider } from "./ui/toast";
import { Toaster } from "./ui/toaster";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AwardIcon,
  BuildingIcon,
  DollarSignIcon,
  FileKey2Icon,
  GiftIcon,
  GitGraphIcon,
  GroupIcon,
  Home,
  LineChart,
  Package,
  Package2,
  ScanBarcodeIcon,
  Settings,
  ShoppingCart,
  Users2,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { WagmiProvider, useAccount } from "wagmi";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~~/components/ui/tooltip";
// import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import Iden3AuthComponent from "~~/utils/privadoId/iden3component";
import { Role } from "~~/utils/privadoId/identities";

const CustomSidebar = () => {
  // Get current page
  const pathname = usePathname();

  return (
    <>
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <ScanBarcodeIcon className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Commit Protocol</span>
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/early-access"
              className={`${
                pathname === "/early-access" ? "bg-accent" : ""
              }  flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8`}
            >
              <FileKey2Icon className="h-5 w-5" />
              <span className="sr-only">Early access</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Early access</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/giftcard"
              className={`${
                pathname === "/giftcard" ? "bg-accent" : ""
              }  flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8`}
            >
              <GiftIcon className="h-5 w-5" />
              <span className="sr-only">Giftcard</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Giftcard</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/airdrop-nft"
              className={`${
                pathname === "/airdrop-nft" ? "bg-accent" : ""
              }  flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8`}
            >
              <AwardIcon className="h-5 w-5" />
              <span className="sr-only">Aleph NFT</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Aleph NFT</TooltipContent>
        </Tooltip>
      </nav>
    </>
  );
};

export { CustomSidebar };
