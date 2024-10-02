import React from "react";
import ManageWhitelistForm from "./components/manage-whitelist-form";
import { getWhitelistAction } from "~~/repository/whitelist/getWhitelist.action";

export default async function CodeGenerator({ params: { protocol } }: { params: { protocol: string } }) {
  const whitelist = await getWhitelistAction({
    slug: protocol,
  });

  return (
    <ManageWhitelistForm
      protocol={protocol}
      // logo={whitelist[0]?.logo}
      whitelistAddress={whitelist[0]?.whitelist_address}
      ownerAddress={whitelist[0]?.wallet}
    />
  );
}
