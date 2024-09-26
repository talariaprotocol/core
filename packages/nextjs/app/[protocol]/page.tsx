"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ManageWhitelistForm from "./manage-whitelist-form";
import { AlertTriangle, BarChart2, Download } from "lucide-react";
import { useWriteContract } from "wagmi";
import { Alert, AlertDescription, AlertTitle } from "~~/components/ui/alert";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { useToast } from "~~/components/ui/use-toast";
import { uppercaseFirstLetter } from "~~/utils";
import { Address } from "viem";

const WHITELIST_MOCK_DATA = {
  address: "0x36711b58f3e7a3c5bf23900f5a42d1651258104d" as Address,
};


export default function CodeGenerator({ params: { protocol } }: { params: { protocol: string } }) {
  const logo = "";
  const owner = "0x123";

  // TODO: query logo from protocol + validate slug
  return (
    <ManageWhitelistForm
      protocol={protocol}
      logo={logo}
      whitelistAddress={WHITELIST_MOCK_DATA.address}
      ownerAddress={owner}
    />
  );
}
