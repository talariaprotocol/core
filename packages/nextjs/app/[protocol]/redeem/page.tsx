import RedeemCodeForm from "./redeem-code-form";
import { Address } from "viem";

const WHITELIST_MOCK_DATA = {
  address: "0x36711b58f3e7a3c5bf23900f5a42d1651258104d" as Address,
};

const RedeemPage = ({ params: { protocol } }: { params: { protocol: string } }) => {
  const logo = "";

  // TODO: query logo from protocol + validate slug

  return <RedeemCodeForm protocol={protocol} logo={logo} whitelistAddress={WHITELIST_MOCK_DATA.address} />;
};

export default RedeemPage;
