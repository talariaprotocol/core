import UserPage from "~~/components/ui/user-page";
import EarlyAccessCodesContractAbi from "~~/contracts-data/deployments/optimismSepolia/EarlyAccessCodes.json";
import EarlyAccessCodesTestContractAbi from "~~/contracts-data/deployments/optimismSepolia/EarlyAccessCodesTestContract.json";
import { EarlyAccesCodeTestAddress, EarlyAccessCodeAddress } from "~~/contracts/addresses";

const EarlyAccessUserPage = ({ params }: { params: { userCode?: string } }) => {
  return (
    <UserPage
      contractAbi={EarlyAccessCodesContractAbi.abi}
      contractAddressMap={EarlyAccessCodeAddress}
      extendedContract={{
        abi: EarlyAccessCodesTestContractAbi.abi,
        map: EarlyAccesCodeTestAddress,
      }}
      contractRestrictedFunction="testFunction"
      title="Early access code"
      subTitle="Execute restricted function, only for selected people like you"
      toastSuccessfullText="Restricted function executed successfully!"
      userCode={params.userCode?.[0]}
    />
  );
};

export default EarlyAccessUserPage;
