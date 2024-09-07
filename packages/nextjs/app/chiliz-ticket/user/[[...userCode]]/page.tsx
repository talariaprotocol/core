import UserPage from "~~/components/ui/user-page";
import MatchTicketAirdropperAbi from "~~/contracts-data/deployments/optimismSepolia/MatchTicketAirdropper.json";
import { GiftCardAddress, MatchTicketAirdropperAddress } from "~~/contracts/addresses";

const EarlyAccessUserPage = ({ params }: { params: { userCode?: string } }) => {
  // const { data: returnedData }: { data?: string } = useReadContract({
  //   abi: GiftCardAbi.abi,
  //   address: GiftCardAddress[OptimismSepoliaChainId],
  //   functionName: "TransferValues",
  //   args: [decodedparams.commitment],
  // });

  return (
    <UserPage
      contractAbi={MatchTicketAirdropperAbi.abi}
      contractAddressMap={MatchTicketAirdropperAddress}
      contractRestrictedFunction="consumeMatchTicketAirdrop"
      title="Redeem Your Access Code"
      subTitle="Have an access code for a match or event? Enter it here to verify and claim your MatchTicket. Once verified, your ticket will be securely stored and available for you to use when it’s game time. Enjoy seamless and secure access to your event!"
      toastSuccessfullText="Match Ticket claimed successfully!"
      userCode={params.userCode?.[0]}
      sendRecipient
    />
  );
};

export default EarlyAccessUserPage;
