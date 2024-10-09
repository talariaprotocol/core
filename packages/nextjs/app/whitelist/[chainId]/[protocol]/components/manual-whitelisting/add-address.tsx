import React, { useEffect } from "react";
import { CheckIcon, Loader2 } from "lucide-react";
import { Address, isAddress } from "viem";
import { useTransactionReceipt, useWriteContract } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { useToast } from "~~/components/ui/use-toast";
import { Whitelist__factory } from "~~/contracts-data/typechain-types";

const AddAddress = ({ whitelistAddress }: { whitelistAddress: Address }) => {
  const [inputValue, setInputValue] = React.useState("");
  const { writeContractAsync, isPending, data: hash } = useWriteContract();
  const { isFetching: isFetchingReceipt, isSuccess: isSuccessReceipt } = useTransactionReceipt({ hash });
  const { toast } = useToast();
  const onSubmit = async () => {
    if (!isAddress(inputValue)) {
      toast({
        title: "Please enter a valid address",
      });
      return;
    }

    await writeContractAsync({
      abi: Whitelist__factory.abi,
      address: whitelistAddress,
      functionName: "addUserToWhitelist",
      args: [inputValue],
    });
  };

  return (
    <div className="max-w-md flex gap-2 items-center">
      <Input value={inputValue} onChange={e => setInputValue(e.target.value)}></Input>
      <Button onClick={onSubmit} type="button">
        Whitelist address
      </Button>
      {isPending || isFetchingReceipt ? (
        <Loader2 className="animate-spin h-8 w-8" />
      ) : (
        isSuccessReceipt && <CheckIcon />
      )}
    </div>
  );
};

export default AddAddress;
