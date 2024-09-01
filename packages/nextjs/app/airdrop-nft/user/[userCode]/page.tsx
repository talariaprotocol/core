import UserPage from "~~/components/ui/user-page";
import AlephNftDropperAbi from "~~/contracts-data/deployments/optimismSepolia/AlephNFTAirdropper.json";
import { AirNftDropperContractAddress, OptimismSepoliaChainId } from "~~/contracts/addresses";

const EarlyAccessUserPage = ({ params }: { params: { userCode: string } }) => {
  // const { data: returnedData }: { data?: string } = useReadContract({
  //   abi: AlephNftDropperAbi.abi,
  //   address: AirNftDropperContractAddress[OptimismSepoliaChainId],
  //   functionName: "TransferId",
  //   args: [decodedparams.commitment],
  // });

  return (
    <UserPage
      contractAbi={AlephNftDropperAbi.abi}
      contractAddressMap={AirNftDropperContractAddress}
      contractRestrictedFunction="consumeAlephNFTAirdrop"
      title="Claim NFT Airdrop"
      subTitle="You have an NFT Airdrop ready to be claimed! Enter the code and submit it to the blockchain"
      toastSuccessfullText="NFT Airdrop claimed successfully!"
      userCode={params.userCode[0]}
      sendRecipient
    />
  );
};

export default EarlyAccessUserPage;
