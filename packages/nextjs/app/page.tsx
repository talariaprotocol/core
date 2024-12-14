"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { useAccount, useTransactionReceipt, useWriteContract } from "wagmi";
import KYCButton from "~~/components/KYCButton.tsx";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { UserContext } from "~~/context";
import { OptimismSepoliaChainId } from "~~/contracts/addresses";
import { TransactionExplorerBaseUrl } from "~~/utils/explorer";

export default function Page() {
  const { user } = useContext(UserContext);
  const account = useAccount();
  const [amount, setAmount] = useState<string>();
  const chainId = account.chainId || OptimismSepoliaChainId;
  const { writeContractAsync, isPending, isSuccess, data: txHash } = useWriteContract();
  const receipt = useTransactionReceipt({ chainId, hash: txHash });
  const kycCompleted = !!user?.hasDoneKYC;

  const handleTransaction = () => {
    alert("Transaction sent");
  };
  return (
    <div className="flex flex-col gap-20 max-w-md">
      <Card className="">
        <CardHeader>
          <CardTitle>Collateral-Free Borrowing</CardTitle>
          <CardDescription>Experience the freedom of borrowing without the need for collateral.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <KYCButton />
          <Input placeholder="XXX USDC" value={amount} onChange={e => setAmount(e.target.value)} />
        </CardContent>
        <CardFooter>
          <Button onClick={handleTransaction} disabled={!kycCompleted || isPending || !amount} className="w-full">
            Execute Transaction
          </Button>
          <Link target="_blank" href={`${TransactionExplorerBaseUrl[chainId]}/${txHash}`} />
        </CardFooter>
      </Card>
    </div>
  );
}
