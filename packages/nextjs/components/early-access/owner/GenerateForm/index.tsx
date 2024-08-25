"use client";

import React from "react";
import EarlyAccessCodesContractAbi from "../../../../contracts-data/deployments/optimismSepolia/EarlyAccessCodes.json";
import { MiniKit } from "@worldcoin/minikit-js";
import { useAccount, useWriteContract } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { NumberContractAddress, OptimismSepoliaChainId, WorldcoinValidatorModuleAddress } from "~~/contracts/addresses";
import { compressEncryptAndEncode } from "~~/helper";
import { generateTransfer } from "~~/contracts-data/helpers/helpers";

const GenerateForm = () => {
  const [codesAmount, setCodesAmount] = React.useState<string>("");
  const account = useAccount();
  const { data: hash, isPending, error, writeContractAsync } = useWriteContract();

  React.useEffect(() => {
    console.log("MINIKIT Is installed:", MiniKit.isInstalled());
  }, []);

  const createEarlyAccessCode = async (commitment: string) => {
    return await writeContractAsync({
      address: NumberContractAddress[OptimismSepoliaChainId],
      account: account.address,
      abi: EarlyAccessCodesContractAbi.abi,
      functionName: "createEarlyAccessCode",
      args: [commitment, [WorldcoinValidatorModuleAddress[OptimismSepoliaChainId]]],
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
    console.log(compressEncryptAndEncode(responseObject));
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
    <div>
      <h5 className="text-lg font-bold">Generate Early access codes</h5>
      {/* <label>Number of codes to generate</label>
      <Input type="number" value={codesAmount} onChange={event => setCodesAmount(event.target.value)} /> */}
      <p>
        By pressing this button, an early access code will be generated. This code will be used by users to access the
        early access program.
      </p>
      <Button onClick={onSubmit}>Generate and submit codes</Button>
    </div>
  );
};

export default GenerateForm;
