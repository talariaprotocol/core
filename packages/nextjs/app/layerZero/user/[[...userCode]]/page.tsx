import UserPageCrossChain from "~~/components/ui/userPageCrossChain";
import AddressFreeBridgeAbi from "~~/contracts-data/deployments/optimismSepolia/AddressFreeBridge.json";
import { layerZeroBridgeAddress } from "~~/contracts/addresses";

const EarlyAccessUserPage = ({ params }: { params: { userCode?: string } }) => {
  return (
    <UserPageCrossChain
      contractAbi={AddressFreeBridgeAbi.abi}
      contractAddressMap={layerZeroBridgeAddress}
      contractRestrictedFunction="consumeBridge"
      title="Claim your giftcard!"
      subTitle="You have a Giftcard ready to be claimed! Use ANY wallet and any chain you want, enter the code and submit it to the blockchain"
      toastSuccessfullText="Giftcard claimed successfully!"
      userCode={params.userCode?.[0]}
      sendRecipient
    />
  );
};

export default EarlyAccessUserPage;
