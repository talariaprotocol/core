import { Address, erc20Abi } from "viem";
import { useAccount, useReadContracts } from "wagmi";

export default function useTokenBalance(address: Address) {
  const account = useAccount();
  const { data } = useReadContracts({
    allowFailure: true,
    contracts: [
      {
        address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [account.address || "0x0"],
      },
      {
        address,
        abi: erc20Abi,
        functionName: "decimals",
      },
      {
        address,
        abi: erc20Abi,
        functionName: "symbol",
      },
    ],
  });

  const [balance, decimals, symbol] = data || [];
  return {
    balance: balance?.result,
    decimals: decimals?.result || 18,
    symbol: symbol?.result,
  };
}
