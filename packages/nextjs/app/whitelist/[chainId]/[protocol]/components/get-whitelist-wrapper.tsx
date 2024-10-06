"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ManageWhitelistForm from "./manage-whitelist-form";
import { Address } from "viem";
import { usePublicClient } from "wagmi";
import { talariaService } from "~~/services/talariaService";

interface GetWhitelistWrapperProps {
  chainId: number;
  whitelistAddress: Address;
}

const GetWhitelistWrapper = ({ chainId, whitelistAddress }: GetWhitelistWrapperProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [owner, setOwner] = useState<Address | undefined>();
  const publicClient = usePublicClient({
    chainId,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchWhitelist = async () => {
      if (!publicClient || !!owner) return;
      console.log("publicClient", publicClient);
      const data = await talariaService.getWhitelistOwner({
        client: publicClient,
        address: whitelistAddress,
      });
      setIsLoading(false);
      setOwner(data);
    };

    fetchWhitelist();
  }, [publicClient]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!owner) {
    router.push("/");
    return null;
  }

  return (
    <ManageWhitelistForm
      chainId={chainId}
      // logo={whitelist.logo}
      whitelistAddress={whitelistAddress}
      ownerAddress={owner}
    />
  );
};

export default GetWhitelistWrapper;
