import React, { useRef, useState } from "react";
import { Hash } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { toast } from "~~/components/ui/use-toast";
import { WhitelistFactory__factory } from "~~/contracts-data/typechain-types";
import { WhitelistFactoryAddresses, polygonTestnet } from "~~/contracts/addresses";
import { createWhitelistAction } from "~~/repository/whitelist/createWhitelist.action";
import { contractService } from "~~/services/contractService";

type SubmittedFormData = {
  name?: string;
  slug?: string;
  logo?: File;
  productUrl?: string;
};

export default function useCreateWhitelist() {
  const hasSavedRef = useRef(false);
  const [isFastCreating, setIsFastCreating] = useState(false);
  const [isCreatingWhitelist, setIsCreatingWhitelist] = useState(false);
  const [isWhitelistCreated, setIsWhitelistCreated] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState<SubmittedFormData | undefined>();

  const publicClient = usePublicClient();
  const { data: hash, isPending, error, writeContractAsync } = useWriteContract();
  const account = useAccount();
  const currentNetwork = account.chainId || polygonTestnet;

  const handleFastCreation = () => {
    setIsFastCreating(true);
    handleSubmit();
  };

  const handleManualCration = ({ e, slug }: { e: React.FormEvent<HTMLFormElement>; slug: string }) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const name = formData.get("name") as string | undefined;
    const productUrl = formData.get("productUrl") as string | undefined;

    const logo = formData.get("logo") as File | undefined;
    let withImage = false;
    if (logo && logo.size > 0 && logo.name !== "" && logo.type.startsWith("image/")) {
      // This is a valid image file
      withImage = true;
    }

    const parsedFormData = {
      logo: withImage ? logo : undefined,
      name,
      productUrl,
      slug,
    };

    setFormData(parsedFormData);
    handleSubmit();
  };

  const handleSubmit = async () => {
    setIsCreatingWhitelist(true);

    try {
      await writeContractAsync({
        abi: WhitelistFactory__factory.abi,
        address: WhitelistFactoryAddresses[currentNetwork],
        functionName: "create",
        args: [],
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Transaction was not submitted",
        variant: "destructive",
      });
      setIsFastCreating(false);
      setIsCreatingWhitelist(false);
      setIsWhitelistCreated(false);
    }
  };

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
          //   logo: formData?.logo, // TODO: Send logo
          protocol_name: formData?.name,
          slug: formData?.slug,
          owner: account.address,
          whitelist_address: whitelistAddress,
          protocolRedirect: formData?.productUrl,
        });
        setCreatedSlug(formData?.slug || whitelistAddress);
        setIsWhitelistCreated(true);
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

  return {
    handleFastCreation,
    handleManualCration,
    isCreatingWhitelist,
    isWhitelistCreated,
    createdSlug,
    isFastCreating,
  };
}
