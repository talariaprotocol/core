"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, BarChart2, Download } from "lucide-react";
import { Address, Hash, Signature } from "viem";
import { useWriteContract } from "wagmi";
import { Alert, AlertDescription, AlertTitle } from "~~/components/ui/alert";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { useToast } from "~~/components/ui/use-toast";
import { generateTransfer } from "~~/contracts-data/helpers/helpers";
import { Whitelist__factory } from "~~/contracts-data/typechain-types/factories/contracts/useCases/whitelist/Whitelist__factory";
import { compressEncryptAndEncode } from "~~/helper";
import { uppercaseFirstLetter } from "~~/utils";

export default function ManageWhitelistForm({
  protocol,
  logo,
  whitelistAddress,
  ownerAddress,
}: {
  protocol: string;
  logo: string;
  whitelistAddress: Address;
  ownerAddress: Address;
}) {
  const [codeCount, setCodeCount] = useState("");
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const { toast } = useToast();
  const { writeContractAsync, isPending, data: hash } = useWriteContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(codeCount);
    if (!isNaN(count) && count > 0) {
      const commitments = Array.from({ length: count }, () => {
        const generatedProof = generateTransfer();

        const compressedObject = compressEncryptAndEncode(generatedProof);
        setGeneratedCodes(prev => [...prev, compressedObject]);

        return generatedProof.commitment as Hash;
      });

      const validationModules = Array.from({ length: count }, () => []);

      // TODO: Generate codes in blockchain
      await writeContractAsync({
        abi: Whitelist__factory.abi,
        address: whitelistAddress,
        functionName: "bulkCreateEarlyAccessCodes",
        args: [commitments, validationModules],
      });
    }

    toast({
      title: "Talaria Codes generated",
    });
  };

  const downloadCSV = useCallback(() => {
    const csvContent = "data:text/csv;charset=utf-8," + generatedCodes.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "talaria_generated_codes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedCodes]);

  // TODO:
  // 1. Ask user to connect
  // 2. Ask user to sign message, if the connected account is the owner
  // 3. Verify signature

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image src="/placeholder.svg" alt="Company Logo" width={100} height={100} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold">{uppercaseFirstLetter(protocol)}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="codeCount">Number of Codes to Generate</Label>
            <Input
              id="codeCount"
              type="number"
              value={codeCount}
              onChange={e => setCodeCount(e.target.value)}
              placeholder="Enter number of codes"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Generate Codes
          </Button>
        </form>

        <Alert variant="default">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>Do not refresh the page, or all created codes will be lost.</AlertDescription>
        </Alert>

        {generatedCodes.length > 0 && (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Generated Codes:</h3>
              <Button onClick={downloadCSV} className="w-full">
                <Download className="mr-2 h-4 w-4" /> Download as CSV
              </Button>
            </div>
            <Link href={`/${protocol}`} className="block">
              <Button variant="outline" className="w-full">
                <BarChart2 className="mr-2 h-4 w-4" /> View Whitelist Insights
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
