"use client";

import {useEffect} from "react";
import {useState} from "react";
import {useAccount} from "wagmi";
import {toast} from "~~/components/ui/use-toast";
import {getWhitelistAction} from "~~/repository/whitelist/getWhitelist.action";
import RedeemCodeForm from "./redeem-code-form";

const RedeemPage = ({ params: { protocol } }: { params: { protocol: string } }) => {

  const account = useAccount();
  const [whitelist, setWhitelist] = useState([]);
  const getWhitelist = async () => {
    try {
      const dbWhitelist = await getWhitelistAction({
        slug: protocol as string,
      });
      setWhitelist(dbWhitelist);
    } catch (error) {
      console.error("Error getting whitelist", error);
      toast({
        title: "Error",
        description: "There was an error getting your whitelist.",
      });
    }
  };

  useEffect(() => {
    if (account.address) {
      getWhitelist();
    }
  }, [account.address]);

  return (
    <RedeemCodeForm
      protocol={protocol}
      logo={whitelist[0]?.logo}
      whitelistAddress={whitelist[0]?.whitelist_address}
      ctaUrl={whitelist[0]?.protocolRedirect}
    />
  );
};

export default RedeemPage;
