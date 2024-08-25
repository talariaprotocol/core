import { ISuccessResult } from "@worldcoin/minikit-js";
import { AbiCoder, solidityPacked, solidityPackedKeccak256, toUtf8Bytes } from "ethers";
import "ethers";
import { decodeAbiParameters, parseAbiParameters } from "viem";

function hashToField(value: string) {
  // Create a keccak256 hash of the input value
  //   const hash = keccak256(toBytes(value));

  const hash = solidityPackedKeccak256(["bytes"], [toUtf8Bytes(value)]);

  // Convert the hash to a BigNumber
  const hashBigNumber = BigInt(hash);
  console.log("hashBigNumber", hashBigNumber);
  // Perform the right shift by 8 bits
  const result = hashBigNumber >> BigInt(8);
  console.log("result", result);
  // Return the result as a number (or a string if the number is too large)
  return result;
}

export const generateWorldIdOnChainParameters = (worldCoinProof: ISuccessResult, accountAddress: string) => {
  // WORLD ID PARAMETERS
  // 1. root (uint256)
  const worldIdRoot = BigInt(worldCoinProof.merkle_root);

  // 2. group id (uint256)
  const worldIdGroupId = 1n;

  // 3. signalHash (uint256)
  const unparsedSignal = accountAddress;
  // Should replicate this: abi.encodePacked(signal).hashToField(),
  const worldIdSignalHash = hashToField(unparsedSignal); //

  // 4. nullifierHash (uint256)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const worldIdNullifierHash = BigInt(worldCoinProof.nullifier_hash);

  // 5. externalNullifierHash (uint256)

  // Should replicate this:  externalNullifierHash = abi
  // .encodePacked(abi.encodePacked(_appId).hashToField(), _action)
  // .hashToField();

  // CHECK: Maybe another toBytes() applied to the toBytes()?
  //   const worldIdExternalNullifierHash = hashToField(
  //     solidityPacked(["bytes", "string"], [toBytes("app_staging_d8e1007ecb659d3ca0a6a9c4f6f61287"), "kyc_investor"]),
  //   );
  const worldIdExternalNullifierHash = hashToField(
    solidityPacked(
      ["bytes", "string"],
      [solidityPacked(["string"], ["app_staging_d8e1007ecb659d3ca0a6a9c4f6f61287"]), "investor-kyc"],
    ),
  );

  // 6. proof (uint256[8])
  const worldIdProof = decodeAbiParameters(parseAbiParameters("uint256[8]"), worldCoinProof?.proof as `0x${string}`)[0];

  const decodedParameters = [
    worldIdRoot,
    worldIdGroupId,
    worldIdSignalHash,
    worldIdNullifierHash,
    worldIdExternalNullifierHash,
    worldIdProof,
  ];

  return decodedParameters;

  const abi = AbiCoder.defaultAbiCoder();
  const encodedParameter = abi.encode(
    ["uint256", "uint256", "uint256", "uint256", "uint256", "uint256[8]"],
    decodedParameters,
  );

  return encodedParameter;
};

export const generateWorldIdOnChainParameter = (worldCoinProof?: ISuccessResult, accountAddress?: string) => {
  const decodedParameters = [
    accountAddress!,
    worldCoinProof ? BigInt(worldCoinProof!.merkle_root) : "",
    worldCoinProof ? BigInt(worldCoinProof!.nullifier_hash) : "",
    decodeAbiParameters(parseAbiParameters("uint256[8]"), worldCoinProof!.proof as `0x${string}`)[0],
  ];

  const abi = AbiCoder.defaultAbiCoder();
  const encodedParameter = abi.encode(["address", "uint256", "uint256", "uint256[8]"], decodedParameters);
  return encodedParameter;
};
