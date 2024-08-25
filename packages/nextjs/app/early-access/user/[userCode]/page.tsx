/* eslint-disable @typescript-eslint/no-var-requires */
"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NumberContractAbi from "../../../../contracts-data/deployments/optimismSepolia/NumberContract.json";
import { ISuccessResult } from "@worldcoin/idkit";
import { useIDKit } from "@worldcoin/idkit";
import { IDKitWidget } from "@worldcoin/idkit";
import { ZeroAddress, hexlify, toBeHex, toBigInt, zeroPadValue } from "ethers";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { BaseError } from "wagmi";
import zlib from "zlib";
import { Button } from "~~/components/ui/button";
import { Card } from "~~/components/ui/card";
import { CardHeader } from "~~/components/ui/card";
import { CardDescription } from "~~/components/ui/card";
import { CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { useToast } from "~~/components/ui/use-toast";
import {
  generateTransfer,
  getRandomRecipient,
  pedersenHash,
  rbigint,
  stringifyBigInts,
  toFixedHex,
} from "~~/contracts-data/helpers/helpers";
import { NumberContractAddress } from "~~/contracts/addresses";
import { decodeDecryptAndDecompress } from "~~/helper";

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-var-requires */

const snarkjs = require("snarkjs");
const path = require("path");
const crypto = require("crypto");

// eslint-disable-next-line prettier/prettier
const MerkleTree = require("fixed-merkle-tree");
const websnarkUtils = require("websnark/src/utils");
const buildGroth16 = require("websnark/src/groth16");
const circuit = require("~~/contracts-data/helpers/withdraw.json");
const levels = 20;

const EarlyAccessUserPage = ({ params }: { params: { userCode: string } }) => {
  const decodedparams = decodeDecryptAndDecompress(params.userCode) as any;
  const [provingKey, setProvingKey] = useState<Buffer | null>(null);

  useEffect(() => {
    const getProvingKey = async () => {
      const provingKeyPath = path.resolve(__dirname, "./withdraw_proving_key.bin");
      const provingKey = await fetch(provingKeyPath);
      const provingKeyParsed = await provingKey.arrayBuffer();
      setProvingKey(Buffer.from(provingKeyParsed));
    };
    void getProvingKey();
  }, []);

  const account = useAccount();
  const [isVerified, setIsVerified] = useState(false);
  const [worldCoinProof, setWorldCoinProof] = useState<ISuccessResult>();
  const [isSigned, setIsSigned] = useState(false);
  const { setOpen } = useIDKit();
  const { data: hash, isPending: isPendingSendNumber, error, writeContractAsync } = useWriteContract();
  const { data: fetchedNumber, isPending: isPendingReadNumber } = useReadContract({
    abi: NumberContractAbi.abi,
    address: NumberContractAddress[11155420],
    functionName: "number",
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const { toast } = useToast();
  const [userContractNumber, setUserContractNumber] = useState<string>("");

  const submitTx = async () => {
    try {
      console.log("Generating markle tree");
      const tree = new MerkleTree(levels);
      tree.insert(decodedparams.commitment);

      const { pathElements, pathIndices } = tree.path(0);
      const input = stringifyBigInts({
        // public
        root: tree.root(),
        nullifierHash: pedersenHash(snarkjs.bigInt(decodedparams.nullifier).leInt2Buff(31)),
        relayer: ZeroAddress,
        recipient: account.address,
        fee: 0,
        refund: 0,
        // private
        nullifier: snarkjs.bigInt(decodedparams.nullifier),
        secret: snarkjs.bigInt(decodedparams.secret),
        pathElements: pathElements,
        pathIndices: pathIndices,
      });

      console.log("proving_key", provingKey);
      const groth16 = await buildGroth16();
      const proofData = await websnarkUtils.genWitnessAndProve(groth16, input, circuit, provingKey?.buffer);
      console.log("proofData", proofData);

      const { proof } = websnarkUtils.toSolidityInput(proofData);
      console.log("proof successfull", proof);
      const root = zeroPadValue(toBeHex(input.root), 32);
      console.log("root", root);
      const nullifierHash = zeroPadValue(toBeHex(input.nullifierHash), 32);
      console.log("nullifierHash", nullifierHash);
      console.log("worldCoinProof", worldCoinProof);
      console.log(userContractNumber, BigInt(userContractNumber));
      const result = await writeContractAsync({
        address: NumberContractAddress[11155420],
        account: account.address,
        abi: NumberContractAbi.abi,
        functionName: "setNumber",
        args: [
          decodedparams.commitment,
          proof,
          root,
          nullifierHash,
          [worldCoinProof?.proof],
          BigInt(userContractNumber),
        ],
      });
      console.log("RESULT", result);
      setIsSigned(true);
    } catch (e) {
      toast({
        description: `Ups, there is an error}`,
      });
      console.error("Error validating user code", e);
    }
  };

  const onSuccessWorldCoin = async (proof?: ISuccessResult) => {
    try {
      setWorldCoinProof(proof);
      setIsVerified(true);
      toast({
        description: "Verification successful. You can now reclame.",
      });
    } catch (error) {
      toast({
        description: `Error: ${(error as BaseError).shortMessage}`,
      });
    }
  };

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-4">
      <Card x-chunk="dashboard-05-chunk-3">
        <CardHeader className="px-7 grid grid-cols-12">
          <div className="col-span-10">
            <CardTitle>Redeem token</CardTitle>
            <CardDescription>You have received an invitation to reclaim the token.</CardDescription>
          </div>
        </CardHeader>
        {account.isConnected ? (
          <>
            <IDKitWidget
              app_id="app_staging_d8e1007ecb659d3ca0a6a9c4f6f61287"
              action="investor-kyc"
              signal={account.address}
              onSuccess={onSuccessWorldCoin}
              autoClose
            />
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold">Enter contract number value</h3>
              <Input
                disabled={isPendingSendNumber}
                value={userContractNumber}
                onChange={e => setUserContractNumber(e.target.value)}
              />
            </div>
            {!isVerified ? (
              <Button onClick={() => setOpen(true)}>
                {isPendingSendNumber ? "Pending, please check your wallet..." : "Verify Humanity"}
              </Button>
            ) : !isSigned ? (
              <Button onClick={submitTx}>
                {isPendingSendNumber ? "Pending, please check your wallet..." : "Sign Document"}
              </Button>
            ) : (
              <Button disabled>Document signed successfully</Button>
            )}
            {hash && (
              <p>
                See transaction in{" "}
                <Link
                  className="cursor-pointer text-blue-500"
                  target="_blank"
                  href={`https://optimism-sepolia.blockscout.com/tx/${hash}`}
                >
                  Blockscout
                </Link>
              </p>
            )}
            {isConfirming && <p>Waiting for confirmation...</p>}
            {isConfirmed && <p>Transaction confirmed.</p>}
            {error && <p>Error: {(error as BaseError).message}</p>}
          </>
        ) : (
          <Button disabled>Please connect your wallet to continue</Button>
        )}
        <Card>
          <h3 className="text-lg font-bold">Current contract number</h3>
          <p>{fetchedNumber as string}</p>
        </Card>
      </Card>
    </div>
  );
};

export default EarlyAccessUserPage;
