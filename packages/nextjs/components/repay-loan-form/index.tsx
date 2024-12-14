"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TOKEN_DECIMALS } from "../request-loan-form";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { formatUnits } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { OptimismSepoliaChainId } from "~~/contracts/addresses";
import { TransactionExplorerBaseUrl } from "~~/utils/explorer";

const RepayLoanForm = () => {
  const [amount, setAmount] = useState("");
  const account = useAccount();
  const chainId = account.chainId || OptimismSepoliaChainId;

  const { data: totalBorrowedData } = useReadContract({
    // abi: {},
    address: "0x123",
    functionName: "totalBorrowed",
    args: [account.address],
  });
  const hasReceiptRef = useRef(false);
  const { writeContractAsync, isPending, isSuccess, data: txHash } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ chainId, hash: txHash });

  const totalBorrowed = formatUnits((totalBorrowedData as bigint) || 0n, TOKEN_DECIMALS);

  const handleTransaction = async () => {
    if (!amount) return;

    if (Number(amount) > Number(totalBorrowed)) {
      toast({
        title: "Amount exceeds maximum",
        variant: "destructive",
      });
      return;
    }

    // await writeContractAsync({
    //   abi: {},
    //   address: "0x123",
    //   functionName: "repay",
    //   args: [parseUnits(amount, TOKEN_DECIMALS)],
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

  if (BigInt((totalBorrowedData as bigint) || 0) === 0n) return null;

  return (
    <div className="flex flex-col gap-20 max-w-md flex-1">
      <Card>
        <CardHeader>
          <CardTitle>Repay Your Loan</CardTitle>
          <CardDescription>Repay your outstanding loan balance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="XXX USDC" value={amount} onChange={e => setAmount(e.target.value)} />
          <p className="text-sm">Your total debt is {totalBorrowed} USDC</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleTransaction} disabled={isPending || !amount} className="w-full">
            Execute Transaction
          </Button>
          {txHash && <Link target="_blank" href={`${TransactionExplorerBaseUrl[chainId]}/${txHash}`} />}
        </CardFooter>
      </Card>
    </div>
  );
};

export default RepayLoanForm;
