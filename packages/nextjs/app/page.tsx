"use client";

import Image from "next/image";
import Link from "next/link";
import { AwardIcon, GiftIcon } from "lucide-react";
import { FileKey2Icon } from "lucide-react";
import { NextPage } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import ChilizLogo from "~~/public/logos/chiliz-logo.png";
import LayerZeroLogo from "~~/public/logos/layerzero-logo.png";

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
            <Card x-chunk="dashboard-05-chunk-1 sm:col-span-1" className="h-full">
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
            <Card x-chunk="dashboard-05-chunk-1 sm:col-span-1" className="h-full">
              <CardHeader className="pb-4 flex flex-col gap-2">
                <CardTitle className="text-2xl">BCN Giftcard</CardTitle>
                <Image className="w-16 self-center" src={ChilizLogo} alt="chiliz-logo" />
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Send tokens to your club members, without knowing their address!
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/airdrop-nft">
            <Card x-chunk="dashboard-05-chunk-1 sm:col-span-1" className="h-full">
              <CardHeader className="pb-4 flex flex-col gap-2">
                <CardTitle className="text-2xl">NFT Airdrop</CardTitle>
                <AwardIcon className="w-32 h-32" />
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">Get an NFT Airdrop for your early adopters</div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/layerZero">
            <Card x-chunk="dashboard-05-chunk-1 sm:col-span-1" className="h-full">
              <CardHeader className="pb-4 flex flex-col gap-2">
                <CardTitle className="text-2xl">Layer zero</CardTitle>
                <Image className="w-16 self-center" height="200" width="200" src={LayerZeroLogo} alt="layerzero-logo" />
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">Send an receive giftcards cross chain</div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
