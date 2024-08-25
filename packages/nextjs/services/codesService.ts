import { generateTransfer } from "../contracts-data/helpers/helpers";

export default class CodesService {
  private async generateCodes() {
    return generateTransfer();
  }

  private async submitCommitments(commitments: any) {
    // TODO: Submit commitment to contract

    // Delay 5 seconds to simulate transaction
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log("Successfull! Here are your codes:", commitments);
  }

  async redeemCommit(commitment: any) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log("Successfull! Here are your codes:", commitment);
  }

  async generateCodesAndSubmitCommitments(amount: number, onGenerateCodes: () => Promise<void>) {
    const generatedCode = await this.generateCodes();
    // const commitments = codes.map(code => code.commitment);

    const commitment = generatedCode.commitment;

    await this.submitCommitments(commitment);
  }
}
