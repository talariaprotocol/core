"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DownloadCodes from "./download-codes";
import GenerateCodesForm from "./generate-codes-form";
import { AlertTriangle, BarChart2Icon, Code, Download, Loader2 } from "lucide-react";
import { Address } from "viem";
import { useEstimateMaxPriorityFeePerGas, useGasPrice, usePublicClient } from "wagmi";
import { Alert, AlertDescription } from "~~/components/ui/alert";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Progress } from "~~/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~~/components/ui/table";
import { talariaService } from "~~/services/talariaService";
import { WhitelistStatistics } from "~~/types/whitelist";

export default function ManageWhitelistForm({
  protocol,
  chainId,
  logo,
  whitelistAddress,
  ownerAddress,
}: {
  protocol: string;
  chainId: number;
  logo?: string;
  whitelistAddress: Address;
  ownerAddress: Address;
}) {
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);
  const publicClient = usePublicClient({
    chainId,
  });
  const [statistics, setStatistics] = useState<WhitelistStatistics>({
    generated: 0,
    whitelistedAddresses: [],
  });

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

  const processedStatistic = useMemo(
    () => ({
      ...statistics,
      consumed: statistics.whitelistedAddresses.length,
      percentage:
        statistics.generated === 0 ? 0 : (statistics.whitelistedAddresses.length / statistics.generated) * 100,
    }),
    [statistics],
  );

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
        <GenerateCodesForm
          ownerAddress={ownerAddress}
          setGeneratedCodes={setGeneratedCodes}
          whitelistAddress={whitelistAddress}
          setIsGeneratingCodes={setIsGeneratingCodes}
        />
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
          <DownloadCodes
            chainId={chainId}
            generatedCodes={generatedCodes}
            isGeneratingCodes={isGeneratingCodes}
            protocol={protocol}
          />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Whitelisted Addresses</CardTitle>
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
