import UserPage from "~~/components/ui/user-page";
import GiftCardAbi from "~~/contracts-data/deployments/optimismSepolia/GiftCards.json";
import { GiftCardAddress } from "~~/contracts/addresses";

const EarlyAccessUserPage = ({ params }: { params: { userCode: string } }) => {
  // const { data: returnedData }: { data?: string } = useReadContract({
  //   abi: GiftCardAbi.abi,
  //   address: GiftCardAddress[OptimismSepoliaChainId],
  //   functionName: "TransferValues",
  //   args: [decodedparams.commitment],
  // });

  return (
    <UserPage
      contractAbi={GiftCardAbi.abi}
      contractAddressMap={GiftCardAddress}
      contractRestrictedFunction="testFunction"
      title="Claim Giftcard"
      subTitle="You have a Giftcard ready to be claimed! Enter the code and submit it to the blockchain"
      toastSuccessfullText="Giftcard claimed successfully!"
      userCode={params.userCode[0]}
    />
  );
};

export default EarlyAccessUserPage;
