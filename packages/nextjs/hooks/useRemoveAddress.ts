import { useEffect } from "react";
import { Address, isAddress } from "viem";
import { useTransactionReceipt, useWriteContract } from "wagmi";
import { useToast } from "~~/components/ui/use-toast";
import { Whitelist__factory } from "~~/contracts-data/typechain-types";

export default function useRemoveAddress({
  inputValue,
  refreshStatistics,
  whitelistAddress,
}: {
  inputValue: string;
  refreshStatistics: () => Promise<void>;
  whitelistAddress: Address;
}) {
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
      functionName: "removeUserFromWhitelist",
      args: [inputValue],
    });
  };

  useEffect(() => {
    // Debounce just in case
    const timeout = setTimeout(() => {
      if (isSuccessReceipt) {
        refreshStatistics();
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isSuccessReceipt]);

  return { isFetchingReceipt, isSuccessReceipt, isPending, onSubmit };
}
