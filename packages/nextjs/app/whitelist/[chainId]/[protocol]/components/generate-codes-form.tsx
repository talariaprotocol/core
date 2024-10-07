import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Code } from "lucide-react";
import { Address, Hash } from "viem";
import { useAccount, useTransactionReceipt, useWriteContract } from "wagmi";
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

interface GenerateCodesFormProps {
  setGeneratedCodes: Dispatch<SetStateAction<string[]>>;
  ownerAddress: Address;
  whitelistAddress: Address;
  setIsGeneratingCodes: (value: boolean) => void;
}

const GenerateCodesForm = ({
  setGeneratedCodes,
  ownerAddress,
  whitelistAddress,
  setIsGeneratingCodes,
}: GenerateCodesFormProps) => {
  const [codeCount, setCodeCount] = useState("50");
  const { toast } = useToast();
  const { writeContractAsync, isPending: isPendingWrite, data: hash } = useWriteContract();
  const { isSuccess: txReceiptSuccess, isFetching } = useTransactionReceipt({ hash });
  const account = useAccount();

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

    for (let i = 0; i < count; i++) {
      const generatedProof = generateTransfer();

      const compressedObject = compressEncryptAndEncode(generatedProof);
      setGeneratedCodes(prev => [...prev, compressedObject]);

      commitments.push(generatedProof.commitment as Hash);
      validationModules.push([]);
    }

    // const singleGasEstimate = 4220740; // Gas used for one commitment
    // const numberOfCodes = commitments.length; // Number of commitments you're processing
    // const gas = BigInt(singleGasEstimate * numberOfCodes * 2); // Add 20% buffer

    // const maxFeePerGas = gasPrice.data;
    // const maxPriorityFeePerGas = maxPriorityFee.data;

    // console.log("bulkGasEstimate", gas);
    // console.log("maxFeePerGas", maxFeePerGas);
    // console.log("maxPriorityFeePerGas", maxPriorityFeePerGas);

    try {
      await writeContractAsync({
        abi: Whitelist__factory.abi,
        address: whitelistAddress,
        functionName: "bulkCreateEarlyAccessCodes",
        args: [commitments, validationModules],
        // gas,
        // gasPrice: maxFeePerGas,
      });

      toast({
        title: "Talaria Codes generated",
      });
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
                    disabled={disabledForm}
                    isLoading={isPendingWrite || isFetching}
                    className="min-w-20 w-full"
                  >
                    Generate
                  </Button>
                </div>
                <div className="col-span-3">
                  <ButtonGroup
                    options={["25", "50", "100"]}
                    selected={codeCount}
                    onChange={newValue => setCodeCount(newValue)}
                    disabled={disabledForm}
                  />
                </div>
              </div>
            </div>
          </form>
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
