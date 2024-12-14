import { Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import RepayLoanForm from "~~/components/repay-loan-form";
import RequestLoanForm from "~~/components/request-loan-form";
import { calculateScoreAndMaxAmount } from "~~/repository/bcra/generateScore";

async function prepareLoanData(userDocument: number) {
  "use server";
  const { maxLoanAmount } = await calculateScoreAndMaxAmount(userDocument);
  const walletClient = privateKeyToAccount(process.env.DEPLOYER_PRIVATE_KEY as Address);
  const parsedAmount = BigInt(maxLoanAmount).toString();
  const signedMessage = await walletClient.signMessage({
    message: parsedAmount,
  });

  return { signedMessage, maxLoanAmount: parsedAmount };
}

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row gap-20 flex-1 justify-center">
        <RequestLoanForm prepareLoanData={prepareLoanData} />
        <RepayLoanForm  />
    </div>
  );
}
