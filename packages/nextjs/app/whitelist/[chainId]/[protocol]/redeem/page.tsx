import RedeemCodeForm from "./redeem-code-form";
import { Selectable } from "kysely";
import { isAddress } from "viem";
import { getWhitelistAction } from "~~/repository/whitelist/getWhitelist.action";
import { getWhitelistByAddressAction } from "~~/repository/whitelist/getWhitelistByAddress.action";
import { WhitelistTable } from "~~/repository/whitelist/whitelist.table";

const RedeemPage = async ({
  params: { protocol: protocolParam, chainId: chainIdParam },
}: {
  params: { protocol: string; chainId: number };
}) => {
  const chainId = Number(chainIdParam);
  const protocol = protocolParam.toLowerCase();

  let whitelist: Selectable<WhitelistTable> | undefined;

  if (isAddress(protocol)) {
    whitelist = await getWhitelistByAddressAction({
      address: protocol,
    });
  } else {
    whitelist = await getWhitelistAction({
      slug: protocol,
    });
  }

  const whitelistAddress = isAddress(protocol) ? protocol : whitelist?.whitelist_address;

  if (!whitelistAddress) {
    return <p>This whitelist doesn't exists :(. Please contact the creator to solve this issue</p>;
  }

  return (
    <RedeemCodeForm
      protocol={whitelist?.slug}
      // logo={whitelist.logo}
      chainId={chainId}
      whitelistAddress={whitelistAddress}
      ctaUrl={whitelist?.protocolRedirect}
    />
  );
};

export default RedeemPage;
