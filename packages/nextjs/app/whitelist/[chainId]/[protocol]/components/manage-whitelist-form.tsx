"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AlertTriangle, BarChart2Icon, Code, Download, Loader2 } from "lucide-react";
import { Address, Hash } from "viem";
import {
  useAccount,
  useEstimateMaxPriorityFeePerGas,
  useGasPrice,
  usePublicClient,
  useTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { ButtonGroup } from "~~/components/button-group";
import { Alert, AlertDescription, AlertTitle } from "~~/components/ui/alert";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Progress } from "~~/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~~/components/ui/table";
import { useToast } from "~~/components/ui/use-toast";
import { generateTransfer } from "~~/contracts-data/helpers/helpers";
import { Whitelist__factory } from "~~/contracts-data/typechain-types/factories/contracts/useCases/whitelist/Whitelist__factory";
import { compressEncryptAndEncode } from "~~/helper";
import { talariaService } from "~~/services/talariaService";
import { WhitelistStatistics } from "~~/types/whitelist";
import { trimAddress, uppercaseFirstLetter } from "~~/utils";

export default function ManageWhitelistForm({
  protocol,
  chainId,
  logo,
  whitelistAddress,
  ownerAddress,
}: {
  protocol?: string;
  chainId: number;
  logo?: string;
  whitelistAddress: Address;
  ownerAddress: Address;
}) {
  const account = useAccount();
  const [codeCount, setCodeCount] = useState("50");
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const { toast } = useToast();
  const { writeContractAsync, isPending: isPendingWrite, data: hash } = useWriteContract();
  const publicClient = usePublicClient({
    chainId,
  });
  const gasPrice = useGasPrice();
  const maxPriorityFee = useEstimateMaxPriorityFeePerGas();
  const [statistics, setStatistics] = useState<WhitelistStatistics>({
    generated: 0,
    whitelistedAddresses: [],
  });
  const { isSuccess, isFetching } = useTransactionReceipt({ hash });

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!publicClient) return;
      const fetchedStatistics = await talariaService.getStatistics({
        publicClient,
        whitelistAddress,
      });

      setStatistics(fetchedStatistics);
    };

    fetchStatistics();
  }, [whitelistAddress, publicClient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(codeCount);
    if (isNaN(count) || count <= 0) {
      toast({
        title: "Invalid number of codes",
      });
      return;
    }

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
  };

  const downloadCSV = useCallback(() => {
    const generatedUrls = generatedCodes.map(
      code => `${process.env.NEXT_PUBLIC_APP_URL}/whitelist/${chainId}/${protocol}/redeem#${code}`,
    );
    const csvContent = generatedUrls.join("\n");
    const encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "talaria_generated_codes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedCodes, protocol]);

  const processedStatistic = useMemo(
    () => ({
      ...statistics,
      consumed: statistics.whitelistedAddresses.length,
      percentage:
        statistics.generated === 0 ? 0 : (statistics.whitelistedAddresses.length / statistics.generated) * 100,
    }),
    [statistics],
  );

  const isOwner = useMemo(() => {
    return ownerAddress?.toLowerCase() === account.address?.toLowerCase();
  }, [ownerAddress, account.address]);

  const disabledForm = isPendingWrite || isFetching || !isOwner || !account.isConnected;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Manage Whitelist</h1>
      <div className="flex items-center gap-4">
        {/* {logo && (
          <div className="h-20 w-auto relative">
            <Image src={logo} alt={`${uppercaseFirstLetter(protocol)} Logo`} fill style={{ objectFit: "contain" }} />
          </div>
        )} */}
        {/* <h3 className="text-2xl font-bold">{uppercaseFirstLetter(protocol)}</h3> */}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    Are you the whitelist owner? Please connect with {trimAddress(ownerAddress)} to manage the
                    whitelist.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <BarChart2Icon className="h-6 w-6" />
              Code Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Code Consumption</span>
                <span className="text-sm font-medium text-gray-700">{processedStatistic.percentage.toFixed(0)}%</span>
              </div>
              <Progress value={processedStatistic.percentage} className="w-full" />
            </div>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Generated Codes</dt>
                <dd className="mt-1 text-3xl font-semibold">{processedStatistic.generated}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Consumed Codes</dt>
                <dd className="mt-1 text-3xl font-semibold">{processedStatistic.consumed}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <div className="flex gap-4 flex-col md:flex-row">
            {generatedCodes.length > 0 && (
              <Alert variant="warning" className="animate-zoomIn">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Do not refresh the page, or all created codes will be lost.</AlertDescription>
              </Alert>
            )}
            <Button
              onClick={downloadCSV}
              className="whitespace-nowrap md:ml-auto flex gap-2 items-center"
              size="lg"
              disabled={!isSuccess}
              type="button"
            >
              <Download className="h-4 w-4" />
              Download codes as CSV
            </Button>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Consumed Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">Wallet Address</TableHead>
                  <TableHead className="w-1/2">Consumed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedStatistic.whitelistedAddresses.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>{user.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
