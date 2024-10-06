import React from "react";
import { notFound } from "next/navigation";
import ManageWhitelistForm from "./components/manage-whitelist-form";
import { getWhitelistAction } from "~~/repository/whitelist/getWhitelist.action";

export default async function CodeGenerator({ params: { protocol } }: { params: { protocol: string } }) {
  const whitelist = await getWhitelistAction({
    slug: protocol,
  });

  if (!whitelist) {
    notFound();
  }

  return (
    <ManageWhitelistForm
      protocol={protocol}
      // logo={whitelist.logo}
      whitelistAddress={whitelist.whitelist_address}
      ownerAddress={whitelist.owner}
    />
  );
}
