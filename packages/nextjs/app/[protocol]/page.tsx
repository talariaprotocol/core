import ManageWhitelistForm from "./components/manage-whitelist-form";
import { Address } from "viem";

const WHITELIST_MOCK_DATA = {
  address: "0x36711b58f3e7a3c5bf23900f5a42d1651258104d" as Address,
};

export default function CodeGenerator({ params: { protocol } }: { params: { protocol: string } }) {
  const logo = "";
  const owner = "0xEB71ed911e4dFc35Da80103a72fE983C8c709F33";

  // TODO: query logo from protocol + validate slug
  // TODO: Also fetch whitelist statistics from thegraph, and revalidate data after new codes are submitted

  return (
    <ManageWhitelistForm
      protocol={protocol}
      logo={logo}
      whitelistAddress={WHITELIST_MOCK_DATA.address}
      ownerAddress={owner}
    />
  );
}
