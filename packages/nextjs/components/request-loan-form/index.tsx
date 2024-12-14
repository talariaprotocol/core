"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "../ui/use-toast";
import { Address, parseUnits } from "viem";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import KYCButton from "~~/components/KYCButton.tsx";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { UserContext } from "~~/context";
import { OptimismSepoliaChainId } from "~~/contracts/addresses";
import { calculateScoreAndMaxAmount } from "~~/repository/bcra/generateScore";
import { UserStatus } from "~~/types/entities/user";
import { TransactionExplorerBaseUrl } from "~~/utils/explorer";

const TOKEN_DECIMALS = 18;

export default function RequestLoanForm({
  prepareLoanData,
}: {
  prepareLoanData: (documentNumber: number) => Promise<{
    signedMessage: Address;
    maxLoanAmount: string;
  }>;
}) {
  const { user } = useContext(UserContext);
  const account = useAccount();
  const [amount, setAmount] = useState<string>();
  const chainId = account.chainId || OptimismSepoliaChainId;
  const { writeContractAsync, isPending, isSuccess, data: txHash } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ chainId, hash: txHash });
  const hasReceiptRef = useRef(false);
  const kycCompleted = user?.status === UserStatus.done;

  const handleTransaction = async () => {
    if (!user || !amount) return;
    const { maxLoanAmount, signedMessage } = await prepareLoanData(Number(user.document));

    if (Number(amount) > Number(maxLoanAmount)) {
      toast({
        title: "Amount exceeds maximum",
        variant: "destructive",
      });
      return;
    }

    // await writeContractAsync({
    //   abi: {},
    //   address: "0x123",
    //   functionName: "borrow",
    //   args: [parseUnits(amount, TOKEN_DECIMALS), parseUnits(maxLoanAmount, TOKEN_DECIMALS), signedMessage],
    // });

    toast({
      title: "Amount exceeds maximum",
      variant: "destructive",
    });
  };

  useEffect(() => {
    if (hasReceiptRef.current) return;

    if (receipt) {
      hasReceiptRef.current = true;
      toast({
        title: "Transaction confirmed",
      });
    }
  }, [receipt]);

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
          {txHash && <Link target="_blank" href={`${TransactionExplorerBaseUrl[chainId]}/${txHash}`} />}
        </CardFooter>
      </Card>
    </div>
  );
}
