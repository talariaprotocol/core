import { useState } from "react";
import Link from "next/link";
import AutoRedirect from "../auto-redirect";
import { Hash } from "viem";
import { useAccount } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { WalletRequiredButton } from "~~/components/wallet-required-button/WalletRequiredButton";
import SlugInput from "~~/components/whitelist/slug-input";
import { TransactionExplorerBaseUrl } from "~~/utils/explorer";

interface ManualCreationProps {
  handleManualCration: ({ e, slug }: { e: React.FormEvent<HTMLFormElement>; slug: string }) => void;
  isCreatingWhitelist: boolean;
  isWhitelistCreated: boolean;
  disableForm: boolean;
  createdSlug?: string;
  hash?: Hash;
}

const ManualCreation = ({
  handleManualCration,
  isCreatingWhitelist,
  isWhitelistCreated,
  disableForm,
  createdSlug,
  hash,
}: ManualCreationProps) => {
  const { isConnected, chainId } = useAccount();
  const [slug, setSlug] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleManualCration({ e, slug });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Whitelist Creation</CardTitle>
        <CardDescription>Input your protocol data for a fully customized whitelist</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input id="name" type="text" name="name" disabled={disableForm} placeholder="Talaria Protocol" />
          </div>
          <div className="space-y-2">
            <SlugInput slug={slug} setSlug={setSlug} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo" className="block">
              Company Logo
            </Label>
            <Input id="logo" name="logo" type="file" accept="image/*" className="w-full" disabled={disableForm} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productUrl">Product CTA URL</Label>
            <Input
              id="productUrl"
              type="text"
              name="productUrl"
              placeholder="your-company.xyz/new-feature"
              disabled={disableForm}
            />
            <p className="text-sm text-muted-foreground">Where to send users after whitelisting</p>
          </div>
          <div className="flex flex-col gap-4">
            <WalletRequiredButton
              showConnectedWalletLabel={true}
              buttonIfWalletIsConnected={
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isCreatingWhitelist || disableForm}
                  isLoading={!disableForm && isCreatingWhitelist}
                  loadingText="Waiting to confirm transaction"
                >
                  {!isConnected ? "Connect Wallet" : "Submit Whitelist"}
                </Button>
              }
            ></WalletRequiredButton>
            {hash && chainId && (
              <Link
                className="cursor-pointer text-xs font-light text-blue-500"
                target="_blank"
                href={`${TransactionExplorerBaseUrl[chainId]}${hash}`}
              >
                See transaction in Explorer
              </Link>
            )}
            {isWhitelistCreated && createdSlug && chainId && (
              <AutoRedirect chainId={chainId} createdSlug={createdSlug} />
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualCreation;
