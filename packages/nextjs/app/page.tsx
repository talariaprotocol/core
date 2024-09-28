"use client";

import React, { useRef, useState } from "react";
import { Hash } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import Landing from "~~/components/landing";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { toast } from "~~/components/ui/use-toast";
import WhitelistFactoryABI from "~~/contracts-data/deployments/arbitrumSepolia/WhitelistFactory.json";
import { WhitelistFactoryAddresses, polygonTestnet } from "~~/contracts/addresses";
import { contractService } from "~~/services/contractService";
import { databaseService } from "~~/services/databaseService";

const codeSnippet = `pragma tu vieja lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.`;

export default function CreateWhitelist() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const hasSavedRef = useRef(false);
  const [productUrl, setProductUrl] = useState("");
  const publicClient = usePublicClient();

  const { data: hash, isPending, error, writeContractAsync } = useWriteContract();

  const account = useAccount();

  const currentNetwork = account.chainId || polygonTestnet;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!name || !slug || !image) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
      });
      setIsSubmitting(false);
      return;
    }

    // TODO: Implement blockchain submission
    await writeContractAsync({
      abi: WhitelistFactoryABI.abi,
      address: WhitelistFactoryAddresses[currentNetwork],
      functionName: "create",
      args: [],
    });

    setIsSubmitting(false);
    setName("");
    setSlug("");
    setImage(null);
  };

  React.useEffect(() => {
    const saveWhitelist = async (hash: Hash) => {
      if (!publicClient || !image) return;
      try {
        const whitelistAddress = await contractService.getWhitelistAddress({
          client: publicClient,
          abi: WhitelistFactoryABI.abi,
          transactionHash: hash,
        });

        await databaseService.createWhitelist({
          address: whitelistAddress,
          name,
          slug,
          image,
          productUrl,
        });

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
    <div className="grid grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Create a new whitelist</h2>
        <div className="space-y-2">
          <Label htmlFor="image">Logo/Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files?.[0] || null)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" type="text" value={slug} onChange={e => setSlug(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="productUrl">Product URL</Label>
          <Input
            id="productUrl"
            type="text"
            value={productUrl}
            onChange={e => setProductUrl(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting || !name || !slug || !image}>
          {isSubmitting ? "Submitting..." : "Submit Whitelist"}
        </Button>
      </form>
      <Landing />
    </div>
  );
}
