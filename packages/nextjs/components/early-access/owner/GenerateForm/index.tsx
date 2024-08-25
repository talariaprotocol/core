"use client";

import React from "react";
import {useWaitForTransactionReceipt} from "wagmi";
import {Label} from "~~/components/ui/label";
import EarlyAccessCodesContractAbi from "~~/contracts-data/deployments/optimismSepolia/EarlyAccessCodes.json";
import { MiniKit } from "@worldcoin/minikit-js";
import { useAccount, useWriteContract } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import {
  EarlyAccessCodeAddress,
  NumberContractAddress,
  OptimismSepoliaChainId,
} from "~~/contracts/addresses";
import { compressEncryptAndEncode } from "~~/helper";
import { generateTransfer } from "~~/contracts-data/helpers/helpers";

const GenerateForm = () => {
  const [compressObject, setCompressObject] = React.useState<string>("");
  const account = useAccount();
  const { data: hash, isPending, error, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: hash });

  React.useEffect(() => {
    console.log("MINIKIT Is installed:", MiniKit.isInstalled());
  }, []);

  const createEarlyAccessCode = async (commitment: string) => {
    return await writeContractAsync({
      address: EarlyAccessCodeAddress[OptimismSepoliaChainId],
      account: account.address,
      abi: EarlyAccessCodesContractAbi.abi,
      functionName: "createEarlyAccessCode",
      args: [commitment, []],
    });
  };

  const onSubmit = async () => {
    // const parsedNumber = Number(codesAmount);
    // if (isNaN(parsedNumber) || parsedNumber <= 0) {
    //   alert("Please enter a valid number");
    //   return;
    // }

    const transfer = generateTransfer();
    const { commitment, nullifier, secret } = transfer;
    const responseObject = {
      commitment: commitment,
      nullifier: nullifier,
      secret: secret,
    };
    console.log("response", responseObject);
    const resultObject = compressEncryptAndEncode(responseObject);
    setCompressObject(resultObject)
    console.log("compress object", resultObject);
    try {
      const result = await createEarlyAccessCode(commitment);
      console.log("ReturnedResult", result);
    } catch (e) {
      console.error("Error creating early access code", e);
    } finally {
      console.log("hash", hash);
      console.log("isPending", isPending);
      console.log("error", error);
    }
  };

  return (
      <main className="mt-8 w-full max-w-4xl">
        <div className="bg-white shadow rounded-lg p-8">
          <div>
            <Label htmlFor="code-type" className="block text-sm font-medium text-gray-700">
              By pressing this button, an early access code will be generated. This code will be used by users to access the
              early access program.
            </Label>
          </div>
          {!isConfirmed ? (
          <div className="mt-6 flex justify-end">
            <Button
                type="button"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={onSubmit}>
              Generate Code
            </Button>
          </div>
          ) : ( <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Generated Code</h2>
            <pre className="mt-4 p-4 bg-gray-100 rounded-md shadow-inner">
              {/* Placeholder for generated code output */}
              <code>{compressObject}</code>
            </pre>
          </div>) }
        </div>
      </main>
  );
};

export default GenerateForm;
