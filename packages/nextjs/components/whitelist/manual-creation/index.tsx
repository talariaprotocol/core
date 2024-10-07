import { useState } from "react";
import Link from "next/link";
import AutoRedirect from "../auto-redirect";
import { useAccount } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { WalletRequiredButton } from "~~/components/wallet-required-button/WalletRequiredButton";
import SlugInput from "~~/components/whitelist/slug-input";

interface ManualCreationProps {
  handleManualCration: ({ e, slug }: { e: React.FormEvent<HTMLFormElement>; slug: string }) => void;
  isCreatingWhitelist: boolean;
  isWhitelistCreated: boolean;
  disableForm: boolean;
  createdSlug?: string;
}

const ManualCreation = ({
  handleManualCration,
  isCreatingWhitelist,
  isWhitelistCreated,
  disableForm,
  createdSlug,
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
                  isLoading={isCreatingWhitelist}
                >
                  {!isConnected ? "Connect Wallet" : "Submit Whitelist"}
                </Button>
              }
            ></WalletRequiredButton>
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
