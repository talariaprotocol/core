import { Abi, Address, Client, PublicClient, getContract, parseUnits } from "viem";

export default class ContractService {
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
    console.log("Events", events);
    const commitments = events
      .map(evt => {
        if ("args" in evt && "commitment" in evt.args) {
          return evt.args["commitment"] as string;
        }
      })
      .filter(com => com !== undefined);

    return commitments;
  }
}
