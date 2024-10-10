"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DownloadCodes from "./download-codes";
import GenerateCodesForm from "./generate-codes-form";
import ManualWhitelisting from "./manual-whitelisting";
import WhitelistedTable from "./whitelisted-table";
import { AlertTriangle, BarChart2Icon, Code, Copy, Download, Loader2 } from "lucide-react";
import { Address } from "viem";
import { useEstimateMaxPriorityFeePerGas, useGasPrice, usePublicClient } from "wagmi";
import Landing from "~~/components/landing";
import { Alert, AlertDescription } from "~~/components/ui/alert";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Progress } from "~~/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~~/components/ui/table";
import { talariaService } from "~~/services/talariaService";
import { WhitelistStatistics } from "~~/types/whitelist";
import { walletSubstring } from "~~/utils/misc";

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

  const fetchStatistics = async () => {
    if (!publicClient) return;
    const fetchedStatistics = await talariaService.getStatistics({
      publicClient,
      whitelistAddress,
    });

    setStatistics(fetchedStatistics);
  };

  useEffect(() => {
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
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <h1 className="text-4xl font-bold mb-0">Manage Whitelist</h1>
        <div className="flex gap-2 items-center">
          <p className="text-sm">{walletSubstring(whitelistAddress)}</p>
          <Copy
            onClick={() => navigator.clipboard.writeText(whitelistAddress)}
            className="h-5 w-5 cursor-pointer"
          ></Copy>
        </div>
      </div>
      {/* <div className="flex items-center gap-4"> */}
      {/* {logo && (
          <div className="h-20 w-auto relative">
            <Image src={logo} alt={`${uppercaseFirstLetter(protocol)} Logo`} fill style={{ objectFit: "contain" }} />
          </div>
        )} */}
      {/* <h3 className="text-2xl font-bold">{uppercaseFirstLetter(protocol)}</h3> */}
      {/* </div> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GenerateCodesForm
          ownerAddress={ownerAddress}
          setGeneratedCodes={setGeneratedCodes}
          whitelistAddress={whitelistAddress}
          setIsGeneratingCodes={setIsGeneratingCodes}
          refetchStatistics={fetchStatistics}
          generatedCodesAmount={processedStatistic.generated}
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
      <WhitelistedTable whitelistedAddresses={processedStatistic.whitelistedAddresses} />
      <ManualWhitelisting whitelistAddress={whitelistAddress} refreshStatistics={fetchStatistics} />
      <Landing />
    </div>
  );
}
