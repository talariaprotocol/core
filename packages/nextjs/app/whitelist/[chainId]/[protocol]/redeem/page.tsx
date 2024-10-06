import { notFound } from "next/navigation";
import RedeemCodeForm from "./redeem-code-form";
import { Address } from "viem";
import { getWhitelistAction } from "~~/repository/whitelist/getWhitelist.action";

const RedeemPage = async ({ params: { protocol } }: { params: { protocol: string } }) => {
  const whitelist = await getWhitelistAction({
    slug: protocol as string,
  });

  if (!whitelist) {
    notFound();
  }

  return (
    <RedeemCodeForm
      protocol={protocol}
      // logo={whitelist.logo}
      whitelistAddress={whitelist.whitelist_address}
      ctaUrl={whitelist.protocolRedirect}
    />
  );
};

export default RedeemPage;
