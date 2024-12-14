import { Address, createWalletClient } from "viem";
import { privateKeyToAccount, signMessage } from "viem/accounts";
import RequestLoanForm from "~~/components/request-loan-form";
import { calculateScoreAndMaxAmount } from "~~/repository/bcra/generateScore";

async function prepareLoanData(userDocument: number) {
  const { maxLoanAmount } = await calculateScoreAndMaxAmount(userDocument);
  const walletClient = privateKeyToAccount(process.env.DEPLOYER_PRIVATE_KEY as Address);
  const parsedAmount = BigInt(maxLoanAmount).toString();
  const signedMessage = await walletClient.signMessage({
    message: parsedAmount,
  });

  return { signedMessage, maxLoanAmount: parsedAmount };
}

export default function Page() {
  return <RequestLoanForm prepareLoanData={prepareLoanData} />;
}
