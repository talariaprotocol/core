import UserPage from "~~/components/ui/user-page";
import WorldChampionNFTAirdropper from "~~/contracts-data/deployments/kinto/WorldChampionNFTAirdropper.json";
import { WorldChampionNFTAirdropperAddress } from "~~/contracts/addresses";

const KintoNFTUserPage = ({ params }: { params: { userCode?: string } }) => {
  // const { data: returnedData }: { data?: string } = useReadContract({
  //   abi: AlephNftDropperAbi.abi,
  //   address: AirNftDropperContractAddress[OptimismSepoliaChainId],
  //   functionName: "TransferId",
  //   args: [decodedparams.commitment],
  // });

  return (
    <UserPage
      contractAbi={WorldChampionNFTAirdropper.abi}
      contractAddressMap={WorldChampionNFTAirdropperAddress}
      contractRestrictedFunction="consumeWorldChampionNFTAirdrop"
      title="Claim World Champion NFT"
      subTitle="You have an NFT ready to be claimed! Enter the code and submit it to the blockchain"
      toastSuccessfullText="World Champion NFT claimed successfully!"
      userCode={params.userCode?.[0]}
      sendRecipient
      h1Title="Are you a World Champion?"
      submitMessage="Submit code and claim NFT"
    />
  );
};

export default KintoNFTUserPage;
