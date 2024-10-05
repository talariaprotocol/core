import RedeemCodeForm from "./redeem-code-form";
import { Address } from "viem";
import { getWhitelistAction } from "~~/repository/whitelist/getWhitelist.action";

const RedeemPage = async ({ params: { protocol } }: { params: { protocol: string } }) => {
  const whitelist = await getWhitelistAction({
    slug: protocol as string,
  });

  return (
    <RedeemCodeForm
      protocol={protocol}
      // logo={whitelist[0]?.logo}
      whitelistAddress={whitelist[0]?.whitelist_address as Address}
      ctaUrl={whitelist[0]?.protocolRedirect}
    />
  );
};

export default RedeemPage;
