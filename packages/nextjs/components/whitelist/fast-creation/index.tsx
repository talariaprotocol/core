import AutoRedirect from "../auto-redirect";
import { ArrowRight } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { WalletRequiredButton } from "~~/components/wallet-required-button/WalletRequiredButton";

interface FastCreationProps {
  handleFastCreation: () => void;
  isWhitelistCreated: boolean;
  isCreatingWhitelist: boolean;
  createdSlug?: string;
}

const FastCreation = ({
  handleFastCreation,
  isWhitelistCreated,
  createdSlug,
  isCreatingWhitelist,
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
        {isWhitelistCreated && createdSlug && chainId && <AutoRedirect chainId={chainId} createdSlug={createdSlug} />}
      </CardContent>
    </Card>
  );
};

export default FastCreation;
