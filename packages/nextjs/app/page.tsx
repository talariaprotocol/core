"use client";

import React, { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Hash } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { toast } from "~~/components/ui/use-toast";
import WhitelistFactoryABI from "~~/contracts-data/deployments/arbitrumSepolia/WhitelistFactory.json";
import { WhitelistFactoryAddresses, polygonTestnet } from "~~/contracts/addresses";
import { contractService } from "~~/services/contractService";

const codeSnippet = `pragma tu vieja lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.`;

export default function BlockchainSubmissionForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const hasSavedRef = useRef(false);
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
      if (!publicClient) return;
      // Get created whitelist address
      const whitelistAddress = await contractService.getWhitelistAddress({
        client: publicClient,
        abi: WhitelistFactoryABI.abi,
        transactionHash: hash,
      });

      console.log("whitelistAddress", whitelistAddress);

      // TODO: Submit to DB
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Whitelist created",
        description: "Your whitelist has been created.",
      });
    };

    if (hash && !hasSavedRef.current && publicClient) {
      console.log("hash", hash);
      hasSavedRef.current = true;
      saveWhitelist(hash);
    }
  }, [hash]);

  return (
    <div className="flex flex-col gap-20 items-center justify-center flex-1">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg">
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
        <Button type="submit" className="w-full" disabled={isSubmitting || !name || !slug || !image}>
          {isSubmitting ? "Submitting..." : "Submit Whitelist"}
        </Button>
      </form>
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal list-inside space-y-2">
            <li>Copy the code snippet below and implement it in your application:</li>
            <div className="bg-muted p-4 rounded-md relative overflow-x-auto">
              <pre className="text-sm pr-10 whitespace-pre-wrap break-all">{codeSnippet}</pre>
              <Button variant="outline" size="icon" className="absolute top-2 right-2" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <li>
              Implement <code>validate_whitelist</code> in your beta contract to check if the user is whitelisted.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
