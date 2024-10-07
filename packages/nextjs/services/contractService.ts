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

  async getWhitelistAddress({
    client,
    abi,
    txReceipt,
  }: {
    client: PublicClient;
    abi: Abi | readonly unknown[];
    txReceipt: TransactionReceipt;
  }) {
    const decodedLogs = txReceipt.logs.map(log => {
      const decodedLog = decodeEventLog({
        abi,
        eventName: "WhitelistCreated",
        data: log.data,
        topics: log.topics,
      });
      return decodedLog;
    });
    // @ts-ignore
    return decodedLogs.find(log => log.eventName === "WhitelistCreated")?.args.whitelist as Address;
  }
}

export const contractService = new ContractService();
