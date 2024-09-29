import { ContractService, contractService } from "./contractService";
import { Address, PublicClient } from "viem";
import { Whitelist__factory } from "~~/contracts-data/typechain-types/factories/contracts/useCases/whitelist/Whitelist__factory";
import { WhitelistStatistics, WhitelistedAddresses } from "~~/types/whitelist";

class TalariaService {
  private readonly contractService: ContractService;
  constructor(contractService: ContractService) {
    this.contractService = contractService;
  }

  async getWhitelistedAddresses({
    publicClient,
    whitelistAddress,
  }: {
    publicClient: PublicClient;
    whitelistAddress: Address;
  }): Promise<WhitelistedAddresses[]> {
    const events = await publicClient.getContractEvents({
      abi: Whitelist__factory.abi,
      address: whitelistAddress,
      eventName: "ConsumeCode",
      fromBlock: 0n,
      toBlock: "latest",
    });

    return events
      .map(
        evt =>
          evt.args.to && {
            address: evt.args.to,
            timestamp: 0n,
          },
      )
      .filter(evt => evt !== undefined) as WhitelistedAddresses[];
  }

  async getStatistics({
    publicClient,
    whitelistAddress,
  }: {
    publicClient: PublicClient;
    whitelistAddress: Address;
  }): Promise<WhitelistStatistics> {
    const whitelistedAddresses = await this.getWhitelistedAddresses({
      publicClient,
      whitelistAddress,
    });

    const generatedCodes = await this.contractService.getPastCommitments({
      client: publicClient,
      abi: Whitelist__factory.abi,
      contractAddress: whitelistAddress,
    });

    return {
      whitelistedAddresses,
      generated: generatedCodes.length,
    };
  }
}

export const talariaService = new TalariaService(contractService);
