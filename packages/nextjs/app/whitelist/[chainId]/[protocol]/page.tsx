import React from "react";
import { redirect } from "next/navigation";
import GetWhitelistWrapper from "./components/get-whitelist-wrapper";
import ManageWhitelistForm from "./components/manage-whitelist-form";
import { Selectable } from "kysely";
import { isAddress } from "viem";
import { getWhitelistAction } from "~~/repository/whitelist/getWhitelist.action";
import { getWhitelistByAddressAction } from "~~/repository/whitelist/getWhitelistByAddress.action";
import { WhitelistTable } from "~~/repository/whitelist/whitelist.table";

export default async function CodeGenerator({
  params: { chainId: chainIdParam, protocol: protocolParam },
}: {
  params: { chainId: string; protocol: string };
}) {
  let whitelist: Selectable<WhitelistTable> | undefined;
  const chainId = Number(chainIdParam);
  const protocol = protocolParam.toLowerCase();

  if (isAddress(protocol)) {
    whitelist = await getWhitelistByAddressAction({
      address: protocol,
      chain_id: chainId,
    });
  } else {
    whitelist = await getWhitelistAction({
      slug: protocol,
    });
  }

  if (isAddress(protocol) && !whitelist) {
    return <GetWhitelistWrapper chainId={chainId} whitelistAddress={protocol} />;
  }

  if (!whitelist) {
    redirect("/");
  }

  return (
    <ManageWhitelistForm
      protocol={protocol}
      chainId={chainId}
      // logo={whitelist.logo}
      whitelistAddress={whitelist.whitelist_address}
      ownerAddress={whitelist.owner}
    />
  );
}
