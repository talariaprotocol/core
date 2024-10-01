"use client";

import {useState, useEffect} from "react";
import React from "react";
import {useAccount} from "wagmi";
import {toast} from "~~/components/ui/use-toast";
import {getWhitelistAction} from "~~/repository/whitelist/getWhitelist.action";
import ManageWhitelistForm from "./components/manage-whitelist-form";

export default function CodeGenerator({ params: { protocol } }: { params: { protocol: string } }) {
  const account = useAccount();
  const [whitelist, setWhitelist] = useState([]);

  // TODO: query logo from protocol + validate slug
  // TODO: Also fetch whitelist statistics from thegraph, and revalidate data after new codes are submitted
  const getWhitelist = async () => {
    try {
      const dbWhitelist = await getWhitelistAction({
        slug: protocol,
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

  // Fetch whitelist data when the component mounts and account address is available
  useEffect(() => {
    if (account.address) {
      getWhitelist();
    }
  }, [account.address]); // Trigger only when account address changes

  return (
      <ManageWhitelistForm
          protocol={protocol}
          logo={whitelist[0]?.logo}
          whitelistAddress={whitelist[0]?.whitelist_address}
          ownerAddress={whitelist[0]?.wallet}
      />
  );
}