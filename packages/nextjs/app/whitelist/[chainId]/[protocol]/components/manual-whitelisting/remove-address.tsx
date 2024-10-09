import React, { useEffect } from "react";
import { CheckIcon, Loader2 } from "lucide-react";
import { Address, isAddress } from "viem";
import { useTransactionReceipt, useWriteContract } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { useToast } from "~~/components/ui/use-toast";
import { Whitelist__factory } from "~~/contracts-data/typechain-types";
import useRemoveAddress from "~~/hooks/useRemoveAddress";

interface RemoveAddressProps {
  refreshStatistics: () => Promise<void>;
  whitelistAddress: Address;
}

const RemoveAddress = ({ refreshStatistics, whitelistAddress }: RemoveAddressProps) => {
  const [inputValue, setInputValue] = React.useState("");

  const { isFetchingReceipt, isPending, isSuccessReceipt, onSubmit } = useRemoveAddress({
    inputValue,
    refreshStatistics,
    whitelistAddress,
  });

  return (
    <div className="max-w-md flex gap-2 items-center">
      <Input value={inputValue} onChange={e => setInputValue(e.target.value)}></Input>
      <Button onClick={onSubmit} type="button" variant="destructive">
        Remove address
      </Button>
      {isPending || isFetchingReceipt ? (
        <Loader2 className="animate-spin h-8 w-8" />
      ) : (
        isSuccessReceipt && <CheckIcon />
      )}
    </div>
  );
};

export default RemoveAddress;
