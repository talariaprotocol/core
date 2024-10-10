import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Code, ExternalLink } from "lucide-react";
import { Address, Hash, encodeFunctionData, formatEther } from "viem";
import { estimateGas } from "viem/actions";
import { useAccount, useGasPrice, usePublicClient, useTransactionReceipt, useWriteContract } from "wagmi";
import { ButtonGroup } from "~~/components/button-group";
import { Alert, AlertDescription } from "~~/components/ui/alert";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { useToast } from "~~/components/ui/use-toast";
import { generateTransfer } from "~~/contracts-data/helpers/helpers";
import { Whitelist__factory } from "~~/contracts-data/typechain-types/factories/contracts/useCases/whitelist/Whitelist__factory";
import { compressEncryptAndEncode } from "~~/helper";
import { trimAddress } from "~~/utils";
import { TransactionExplorerBaseUrl } from "~~/utils/explorer";

const MAX_AMOUNT = 1024;

interface GenerateCodesFormProps {
  setGeneratedCodes: Dispatch<SetStateAction<string[]>>;
  ownerAddress: Address;
  whitelistAddress: Address;
  setIsGeneratingCodes: (value: boolean) => void;
  refetchStatistics: () => Promise<void>;
  generatedCodesAmount: number;
  chainId: number;
}

const GenerateCodesForm = ({
  setGeneratedCodes,
  ownerAddress,
  whitelistAddress,
  setIsGeneratingCodes,
  refetchStatistics,
  generatedCodesAmount,
  chainId,
}: GenerateCodesFormProps) => {
  const [codeCount, setCodeCount] = useState("4");
  const { toast } = useToast();
  const { writeContractAsync, isPending: isPendingWrite, data: hash } = useWriteContract();
  const { isSuccess: txReceiptSuccess, isFetching } = useTransactionReceipt({ hash });
  const account = useAccount();
  const publicClient = usePublicClient();
  const gasPrice = useGasPrice();
  const [submittedCodes, setSubmittedCodes] = useState<string[]>([]);

  const maxAmountReached = generatedCodesAmount > MAX_AMOUNT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(codeCount);
    if (isNaN(count) || count <= 0) {
      toast({
        title: "Invalid number of codes",
      });
      return;
    }

    setIsGeneratingCodes(true);
    const commitments: Hash[] = [];
    const validationModules: Address[][] = [];
    const generatedProofs: string[] = [];

    for (let i = 0; i < count; i++) {
      const generatedProof = generateTransfer();

      const compressedObject = compressEncryptAndEncode(generatedProof);
      generatedProofs.push(compressedObject);

      commitments.push(generatedProof.commitment as Hash);
      validationModules.push([]);
    }

    // const singleGasEstimate = 4220740; // Gas used for one commitment
    // const numberOfCodes = commitments.length; // Number of commitments you're processing
    // const gas = BigInt(singleGasEstimate * numberOfCodes * 2); // Add 20% buffer

    // const maxFeePerGas = gasPrice.data;
    // const maxPriorityFeePerGas = maxPriorityFee.data;

    // console.log("bulkGasEstimate", gas);
    const maxFeePerGas = await publicClient?.estimateMaxPriorityFeePerGas();
    // console.log("maxPriorityFeePerGas", maxPriorityFeePerGas);

    const estimatedGas = await publicClient?.estimateGas({
      account: account.address,
      to: whitelistAddress,
      value: 0n,
      data: encodeFunctionData({
        abi: Whitelist__factory.abi,
        functionName: "bulkCreateEarlyAccessCodes",
        args: [commitments, validationModules],
      }),
    });

    console.log("gasPrice", gasPrice);
    console.log("maxFeePerGas", maxFeePerGas);
    console.log("estimatedGas", estimatedGas);

    const gasLimit = estimatedGas ? (estimatedGas * 130n) / 100n : undefined;

    console.log("gasLimit", gasLimit);

    const isAbove1ETH = gasLimit && maxFeePerGas && formatEther(gasLimit * maxFeePerGas);

    if (Number(isAbove1ETH) >= 1) {
      toast({
        title: `Gas is too high (${isAbove1ETH} ETH), please reduce the amount of codes`,
        variant: "destructive",
      });
      return;
    }

    try {
      await writeContractAsync({
        abi: Whitelist__factory.abi,
        address: whitelistAddress,
        functionName: "bulkCreateEarlyAccessCodes",
        args: [commitments, validationModules],
        gas: gasLimit,
        gasPrice: maxFeePerGas,
      });

      setSubmittedCodes(generatedProofs);
    } catch (e) {
      toast({
        title: "Transaction was not submitted",
        variant: "destructive",
      });
      setIsGeneratingCodes(false);
    }
  };

  useEffect(() => {
    if (txReceiptSuccess) {
      toast({
        title: "Talaria Codes generated",
      });
      setGeneratedCodes(prev => [...prev, ...submittedCodes]);
      refetchStatistics();
      setIsGeneratingCodes(false);
    }
  }, [txReceiptSuccess]);

  const isOwner = useMemo(() => {
    return ownerAddress.toLowerCase() === account.address?.toLowerCase();
  }, [ownerAddress, account.address]);

  const disabledForm = isPendingWrite || isFetching || !isOwner || !account.isConnected;

  return (
    <div className="lg:col-span-1 flex flex-col gap-4">
      <Card className="w-full flex-1">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <Code className="w-5 h-5" />
            Generate Codes
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 flex flex-col gap-2">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Codes
              </label>
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-3">
                  <Input
                    type="number"
                    id="amount"
                    name="amount"
                    required
                    min="1"
                    value={codeCount}
                    onChange={e => setCodeCount(e.target.value)}
                    disabled={disabledForm}
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="submit"
                    disabled={disabledForm || maxAmountReached}
                    isLoading={isPendingWrite || isFetching}
                    className="min-w-20 w-full"
                    loadingText={
                      isPendingWrite
                        ? "Submitting..."
                        : isFetching && txReceiptSuccess
                          ? "Waiting for confirmation..."
                          : undefined
                    }
                  >
                    {maxAmountReached ? "Max reached" : "Generate"}
                  </Button>
                  {hash && (
                    <Link
                      className="cursor-pointer flex gap-2 items-center"
                      target="_blank"
                      href={`${TransactionExplorerBaseUrl[chainId]}${hash}`}
                    >
                      Open in explorer <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                </div>
                <div className="col-span-3">
                  <ButtonGroup
                    options={["2", "4", "8"]}
                    selected={codeCount}
                    onChange={newValue => setCodeCount(newValue)}
                    disabled={disabledForm}
                  />
                </div>
              </div>
            </div>
          </form>
          {Number(codeCount) > 8 && (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                For gas limitations, we suggest generating up to 8 codes per transaction
              </AlertDescription>
            </Alert>
          )}
          {!isOwner && (
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Are you the whitelist owner? Please connect with {trimAddress(ownerAddress)} to manage the whitelist.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerateCodesForm;
