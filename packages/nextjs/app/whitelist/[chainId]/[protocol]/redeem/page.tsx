import RedeemCodeForm from "./redeem-code-form";
import { isAddress } from "viem";
import { getWhitelistAction } from "~~/repository/whitelist/getWhitelist.action";

const RedeemPage = async ({ params: { protocol } }: { params: { protocol: string } }) => {
  const whitelist = await getWhitelistAction({
    slug: protocol as string,
  });

  if (!whitelist && !isAddress(protocol)) {
    return <p>This whitelist doesn't exists :(. Please contact the creator to solve this issue</p>;
  }

  if (!isAddress(protocol)) {
    return <p>Please check your whitelist address in the url in order to be whitelisted</p>;
  }

  return (
    <RedeemCodeForm
      protocol={protocol}
      // logo={whitelist.logo}
      whitelistAddress={whitelist?.whitelist_address || protocol}
      ctaUrl={whitelist?.protocolRedirect}
    />
  );
};

export default RedeemPage;
