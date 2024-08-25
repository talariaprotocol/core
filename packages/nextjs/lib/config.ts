import { fallback, injected, unstable_connector } from "@wagmi/core";
import { getDefaultConfig } from "connectkit";
import { type Chain } from "viem";
import { createConfig, http } from "wagmi";

export const chain: Chain = {
  id: 11155420,
  name: "Optimism Sepolia Anvil Fork",
  nativeCurrency: {
    decimals: 18,
    name: "Optimism Sepolia Anvil Fork Ether",
    symbol: "SETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545/"] },
  },
  testnet: true,
};

export const zkChain: Chain = {
    id: 300,
    name: "Zk Sepolia testnet ",
    nativeCurrency: {
        decimals: 18,
        name: "zkNetwork Sepolia",
        symbol: "ETH",
    },
    rpcUrls: {
        default: { http: ["http://127.0.0.1:8546/"] },
    },
    testnet: true,
};

export const config = createConfig(
  getDefaultConfig({
    chains: [chain, zkChain],
    transports: {
      [chain.id]: fallback([unstable_connector(injected), http(chain.rpcUrls.default.http[0])]),
    },
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
    appName: "World ID Onchain Template",
  }),
);
