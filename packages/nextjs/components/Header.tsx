"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "./ScaffoldEthAppWithProviders";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  BarChart,
  BuildingIcon,
  DollarSignIcon,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Search,
  ShoppingCart,
  Users2,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import QRCode from "qrcode.react";
import { useAccount } from "wagmi";
import { BugAntIcon } from "@heroicons/react/24/outline";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~~/components/ui/breadcrumb";
import { Button } from "~~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~~/components/ui/dropdown-menu";
import { Input } from "~~/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "~~/components/ui/sheet";
import { CUSTOM_WALLET_PAGES } from "~~/constants";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { Role, getRoleCredentialProofRequest } from "~~/utils/privadoId/identities";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  // Get current page
  const pathname = usePathname();

  const { address } = useAccount();
  useEffect(() => {
    if (!address) return;

    // getRoleCredentialProofRequest(address, "investor", "acme").then(req => {
    //   setInvestorQR(JSON.stringify(req));
    // });

    // getRoleCredentialProofRequest(address, "founder", "acme").then(req => {
    //   setFounderQR(JSON.stringify(req));
    // });

    // getRoleCredentialProofRequest(address, "employee", "acme").then(req => {
    //   setEmployeeQR(JSON.stringify(req));
    // });
  }, [address]);

  const roleContext = useRole();

  const [polling, setPolling] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const checkRole = async () => {
    console.log("role", roleContext?.role);
    fetch("/api/role?address=" + address)
      .then(res => res.json())
      .then(data => {
        console.log("roles from backend: ", data);
        const dataRoles = data as {
          data: {
            role: Role;
          }[];
        };

        if (!dataRoles?.data || dataRoles?.data.length === 0) {
          return;
        }

        roleContext?.setRole({ ...roleContext, role: dataRoles?.data[0].role });
        setIsDialogOpen(false); // Close the dialog when role is set
      })
      .catch(error => {
        console.error("Error fetching roles: ", error);
      });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (polling) {
      checkRole(); // Check immediately
      interval = setInterval(checkRole, 2000); // Check every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [polling]);

  const usesCustomConnectButton = CUSTOM_WALLET_PAGES.some(page => pathname.includes(page));

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {/* <Breadcrumb></Breadcrumb> */}
      <div className="w-full flex items-center justify-end">
        <div className="relative ml-auto flex-1 md:grow-0">{!usesCustomConnectButton && <ConnectButton />}</div>
      </div>
    </header>
  );
};
