import {
  Abi,
  Address,
  Client,
  Hash,
  PublicClient,
  TransactionReceipt,
  decodeEventLog,
  getContract,
  parseUnits,
} from "viem";
import { UseWaitForTransactionReceiptParameters, useWaitForTransactionReceipt } from "wagmi";
import { WhitelistFactory__factory } from "~~/contracts-data/typechain-types";

export class ContractService {
  async getPastCommitments({
    client,
    abi,
    contractAddress,
  }: {
    client: PublicClient;
    abi: Abi | readonly unknown[];
    contractAddress: Address;
  }) {
    const events = await client.getContractEvents({
      abi,
      address: contractAddress,
      eventName: "NewCode",
      fromBlock: 0n,
      toBlock: "latest",
    });

    const commitments = events
      .map(evt => {
        if ("args" in evt && "commitment" in evt.args) {
          return evt.args["commitment"] as string;
        }
      })
      .filter(com => com !== undefined);

    return commitments;
  }

  async getWhitelistAddress({ txReceipt }: { txReceipt: TransactionReceipt }) {
    const decodedLogs = txReceipt.logs
      .map(log => {
        try {
          const decodedLog = decodeEventLog({
            abi: WhitelistFactory__factory.abi,
            eventName: "WhitelistCreated",
            data: log.data,
            topics: log.topics,
          });
          return decodedLog;
        } catch {}
      })
      .filter(log => !!log);

    // @ts-ignore
    return decodedLogs.find(log => log.eventName === "WhitelistCreated")?.args.whitelist as Address;
  }
}

export const contractService = new ContractService();
