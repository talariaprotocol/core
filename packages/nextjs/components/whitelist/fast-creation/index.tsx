import Link from "next/link";
import AutoRedirect from "../auto-redirect";
import { ArrowRight } from "lucide-react";
import { Hash } from "viem";
import { useAccount } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { WalletRequiredButton } from "~~/components/wallet-required-button/WalletRequiredButton";
import { TransactionExplorerBaseUrl } from "~~/utils/explorer";

interface FastCreationProps {
  handleFastCreation: () => void;
  isWhitelistCreated: boolean;
  isCreatingWhitelist: boolean;
  createdSlug?: string;
  hash?: Hash;
}

const FastCreation = ({
  handleFastCreation,
  isWhitelistCreated,
  createdSlug,
  isCreatingWhitelist,
  hash,
}: FastCreationProps) => {
  const { chainId } = useAccount();
  return (
    <Card className="bg-primary/5">
      <CardHeader>
        <CardTitle>Fast Whitelist Creation</CardTitle>
        <CardDescription>Skip manual entry and create your whitelist instantly</CardDescription>
      </CardHeader>
      <CardContent>
        <WalletRequiredButton
          showConnectedWalletLabel={false}
          buttonIfWalletIsConnected={
            <Button
              size="lg"
              onClick={handleFastCreation}
              className="w-full"
              isLoading={isCreatingWhitelist}
              loadingText="Waiting to confirm transaction"
            >
              Create with One Click <ArrowRight className="ml-2 h-4 w-4" />
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
        {isWhitelistCreated && createdSlug && chainId && <AutoRedirect chainId={chainId} createdSlug={createdSlug} />}
      </CardContent>
    </Card>
  );
};

export default FastCreation;
