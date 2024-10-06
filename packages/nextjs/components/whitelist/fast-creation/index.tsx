import AutoRedirect from "../auto-redirect";
import { ArrowRight } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";

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
        <Button size="lg" onClick={handleFastCreation} className="w-full" isLoading={isCreatingWhitelist}>
          Create with One Click <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        {isWhitelistCreated && createdSlug && chainId && <AutoRedirect chainId={chainId} createdSlug={createdSlug} />}
      </CardContent>
    </Card>
  );
};

export default FastCreation;
