"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Hash } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import SlugInput from "~~/components/homepage/slug-input";
import Landing from "~~/components/landing";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import Divider from "~~/components/ui/divider";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { toast } from "~~/components/ui/use-toast";
import FastCreation from "~~/components/whitelist/fast-creation";
import { WhitelistFactory__factory } from "~~/contracts-data/typechain-types";
import { WhitelistFactoryAddresses, polygonTestnet } from "~~/contracts/addresses";
import { createWhitelistAction } from "~~/repository/whitelist/createWhitelist.action";
import { contractService } from "~~/services/contractService";

export default function CreateWhitelist() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasSavedRef = useRef(false);
  const [productUrl, setProductUrl] = useState("");
  const publicClient = usePublicClient();

  const { data: hash, isPending, error, writeContractAsync } = useWriteContract();

  const account = useAccount();

  const currentNetwork = account.chainId || polygonTestnet;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);

    await writeContractAsync({
      abi: WhitelistFactory__factory.abi,
      address: WhitelistFactoryAddresses[currentNetwork],
      functionName: "create",
      args: [],
    });
    setIsSubmitting(false);
  };

  const [isWhitelistSaved, setIsWhitelistSaved] = useState(false);

  React.useEffect(() => {
    const saveWhitelist = async (hash: Hash) => {
      if (!publicClient || !account.address) return;
      try {
        const whitelistAddress = await contractService.getWhitelistAddress({
          client: publicClient,
          abi: WhitelistFactory__factory.abi,
          transactionHash: hash,
        });
        await createWhitelistAction({
          logo: "/brand/197297796.png",
          protocol_name: name,
          slug: slug,
          wallet: account.address,
          whitelist_address: whitelistAddress,
          protocolRedirect: productUrl,
        });
        setIsWhitelistSaved(true);
        toast({
          title: "Whitelist created",
          description: "Your whitelist has been created.",
        });
      } catch (error) {
        console.error("Error saving whitelist", error);
        toast({
          title: "Error",
          description: "There was an error saving your whitelist.",
        });
      }
    };

    if (hash && !hasSavedRef.current && publicClient) {
      hasSavedRef.current = true;
      saveWhitelist(hash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  return (
    <div className="flex flex-col gap-8 max-w-md">
      <FastCreation handleCreate={handleSubmit} />
      <Divider text="Or create manually" />
      <Card>
        <CardHeader>
          <CardTitle>Manual Whitelist Creation</CardTitle>
          <CardDescription>Input your protocol data for a fully customized whitelist</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Talaria Protocol"
              />
            </div>
            <div className="space-y-2">
              <SlugInput slug={slug} setSlug={setSlug} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo" className="block">
                Company Logo
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={e => setImage(e.target.files?.[0] ?? null)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productUrl">Product CTA URL (optional)</Label>
              <Input
                id="productUrl"
                type="text"
                value={productUrl}
                onChange={e => setProductUrl(e.target.value)}
                placeholder="your-company.xyz/new-feature"
              />
              <p className="text-sm text-muted-foreground">Where to send users after whitelisting</p>
            </div>
            <div className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isSubmitting || !name || !slug || !image || !account}>
                {!account ? "Connect Wallet" : isSubmitting ? "Submitting..." : "Submit Whitelist"}
              </Button>
              <Link href={`/${slug}`} className={`w-full ${!isWhitelistSaved ? "pointer-events-none" : ""}`}>
                <Button className="w-full" disabled={!isWhitelistSaved} variant="outline">
                  Start generating codes
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <Landing />
    </div>
  );
}
