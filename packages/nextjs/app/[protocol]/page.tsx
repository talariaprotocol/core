import ManageWhitelistForm from "./components/manage-whitelist-form";
import { Address } from "viem";

const WHITELIST_MOCK_DATA = {
  address: "0x36711b58f3e7a3c5bf23900f5a42d1651258104d" as Address,
};

export default function CodeGenerator({ params: { protocol } }: { params: { protocol: string } }) {
  const logo = "";
  const owner = "0x7C22B07a9D65228A54390B03Bc109e46D3BB94Ef";

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
