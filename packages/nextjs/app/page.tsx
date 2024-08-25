"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AwardIcon, GiftIcon, TrendingUp } from "lucide-react";
import { FileKey2Icon } from "lucide-react";
import { NextPage } from "next";
import { Bar, BarChart, LabelList, XAxis } from "recharts";
import { Pie, PieChart } from "recharts";
import { useRole } from "~~/components/ScaffoldEthAppWithProviders";
import { Badge } from "~~/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "~~/components/ui/chart";
import { Progress } from "~~/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~~/components/ui/table";

const Home: NextPage = () => {
  return (
    <>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-4">
        <div className="grid gap-4 sm:grid-cols-5">
          <Card className="md:col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Commit Protocol</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Share descentralized access.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="grid sm:grid-cols-4 gap-4">
          <Link href="/early-access">
            <Card x-chunk="dashboard-05-chunk-1 sm:col-span-1">
              <CardHeader className="pb-4 flex flex-col gap-2">
                <CardTitle className="text-2xl">Early access</CardTitle>
                <FileKey2Icon className="w-32 h-32" />
                {/* <CardDescription> */}
                {/* Early access */}
                {/* </CardDescription> */}
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">Share limited access to your new features</div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/giftcard">
            <Card x-chunk="dashboard-05-chunk-1 sm:col-span-1">
              <CardHeader className="pb-4 flex flex-col gap-2">
                <CardTitle className="text-2xl">Giftcard</CardTitle>
                <GiftIcon className="w-32 h-32" />
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">Transfer value with just a code</div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/aleph-nft">
            <Card x-chunk="dashboard-05-chunk-1 sm:col-span-1">
              <CardHeader className="pb-4 flex flex-col gap-2">
                <CardTitle className="text-2xl">Aleph Badge Airdrop</CardTitle>
                <AwardIcon className="w-32 h-32" />
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">Get a Aleph Badge for your early adopters</div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
