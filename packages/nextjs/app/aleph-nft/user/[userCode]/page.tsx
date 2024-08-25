/* eslint-disable @typescript-eslint/no-var-requires */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AlephNftDropperAbi from "~~/contracts-data/deployments/optimismSepolia/AlephNFTAirdropper.json"
import { ethers } from "ethers";
import { ZeroAddress, hexlify, toBeHex, toBigInt, zeroPadValue } from "ethers";
import { useReadContract } from "wagmi";
import { useAccount, useSignMessage, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { BaseError } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Card } from "~~/components/ui/card";
import { CardHeader } from "~~/components/ui/card";
import { CardDescription } from "~~/components/ui/card";
import { CardTitle } from "~~/components/ui/card";
import { useToast } from "~~/components/ui/use-toast";
import { pedersenHash, stringifyBigInts } from "~~/contracts-data/helpers/helpers";
import { AirNftDropperContractAddress, OptimismSepoliaChainId } from "~~/contracts/addresses";
import { decodeDecryptAndDecompress } from "~~/helper";
import { useRole } from "~~/components/ScaffoldEthAppWithProviders";
import QRCode from "qrcode.react";

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
const circuit = require("../../../../contracts-data/helpers/withdraw.json");
const levels = 20;

import {
  Role,
  getRoleCredentialProofRequest,
} from "~~/utils/privadoId/identities";

const AirdropperNftUserPage = ({ params }: { params: { userCode: string } }) => {
  console.log(params.userCode);
  const decodedparams = decodeDecryptAndDecompress(params.userCode) as any;
  console.log(decodedparams);
  const [provingKey, setProvingKey] = useState<Buffer | null>(null);
  const [QR, setQR] = useState<string>("");
  const [proof, setProof] = useState<any>("");
  const [polling, setPolling] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const roleContext = useRole();
  const { address } = useAccount();

  const account = useAccount();
  const [isSigned, setIsSigned] = useState(false);
  const { data: hash, isPending, error, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const { toast } = useToast();

  useEffect(() => {
    const getProvingKey = async () => {
      const provingKeyPath = path.resolve(__dirname, "./withdraw_proving_key.bin");
      const provingKey = await fetch(provingKeyPath);
      const provingKeyParsed = await provingKey.arrayBuffer();
      setProvingKey(Buffer.from(provingKeyParsed));
    };
    void getProvingKey();
  }, []);

  useEffect(() => {
    if (!address) return;
    getRoleCredentialProofRequest(address).then(request => {
      setQR(JSON.stringify(request));
    });
  }, [address]);

  const checkRole = async () => {
    console.log("role", roleContext?.role);
    fetch("/api/role?address=" + address)
      .then(res => res.json())
      .then(data => {
        setPolling(false);
        setProof(data);
        console.log("roles from backend: ", data);
        const dataRoles = data as {
          data: {
            role: Role;
          }[];
        };

        if (!dataRoles?.data || dataRoles?.data.length === 0) {
          return;
        }

        roleContext?.setRole({ ...roleContext, role: dataRoles?.data[0].role });
        setIsDialogOpen(false);
      })
      .catch(error => {
        console.error("Error fetching roles: ", error);
      });
  };
  
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (polling) {
      checkRole(); // Check immediately
      interval = setInterval(checkRole, 2000); // Check every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [polling]);

  useEffect(() => {
      setPolling(true);
  }, []);
  
  const { data: returnedData }: { data?: string } = useReadContract({
    abi: AlephNftDropperAbi.abi,
    address: AirNftDropperContractAddress[OptimismSepoliaChainId],
    functionName: "TransferId",
    args: [decodedparams.commitment],
  });

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
      const root = zeroPadValue(toBeHex(input.root), 32);
      const nullifierHash = zeroPadValue(toBeHex(input.nullifierHash), 32);
      const result = await writeContractAsync({
        address: AirNftDropperContractAddress[OptimismSepoliaChainId],
        account: account.address,
        abi: AlephNftDropperAbi.abi,
        functionName: "consumeAlephNFTAirdrop",
        args: [decodedparams.commitment, proof, root, nullifierHash, account.address, []],
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

  return (
    <>
    {!proof ? (
      <div>
          <h1>🇦🇷 Welcome Aleph Citizens! - Please Verify yourself to get your badge. 🇦🇷</h1>
          <QRCode
            // size={256}
            height={100}
            width={100}
            style={{ maxHeight: "400px", maxWidth: "400px" }}
            value={QR ?? ""}
            viewBox={`0 0 256 256`}
          />
        </div>
    ) : (
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-4">
      <Card x-chunk="dashboard-05-chunk-3">
        <CardHeader className="px-7 grid grid-cols-12">
          <div className="col-span-10">
            <CardTitle>Claim your aidrop</CardTitle>
            <CardDescription>You have received an invitation to reclaim the airdrop.</CardDescription>
          </div>
        </CardHeader>
        {account.isConnected ? (
          <>
            {!isSigned ? (
              <Button onClick={submitTx}>{isPending ? "Pending, please check your wallet..." : "Sign Document"}</Button>
            ) : (
              <Button disabled>Document signed successfully</Button>
            )}
            {hash && (
              <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-4">
                <div className="relative w-96 h-56 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg overflow-hidden mb-8">
                  {/* Decorative Background Elements */}
                  <div className="absolute inset-0 bg-opacity-20 bg-white pointer-events-none">
                    <svg
                      className="absolute top-0 right-0 w-32 h-32 opacity-50"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 500 500"
                    >
                      <circle cx="250" cy="250" r="250" fill="url(#paint0_linear)" />
                      <defs>
                        <linearGradient
                          id="paint0_linear"
                          x1="250"
                          y1="0"
                          x2="250"
                          y2="500"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#fff" stopOpacity="0.5" />
                          <stop offset="1" stopColor="#fff" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Gift Card Content */}
                  <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                    {/* Gift Card Title */}
                    <div>
                      <h2 className="text-white text-3xl font-bold">NFT</h2>
                      <p className="text-white text-sm">A special Nft just for you</p>
                    </div>

                    {/* Gift Card Amount */}
                    <div className="text-center">
                      <p className="text-white text-lg">Nft</p>
                      <p id="previewAmount" className="text-4xl font-bold text-yellow-400">
                        {returnedData && ethers.formatEther(BigInt(returnedData))}
                      </p>
                    </div>
                  </div>

                  {/* Additional Decorative Element */}
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600 bg-opacity-30 rounded-full transform translate-y-16 -translate-x-16"></div>
                </div>
                <p>
                  See transaction in{"optimism-sepolia"}
                  <Link
                    className="cursor-pointer text-blue-500"
                    target="_blank"
                    href={`https://optimism-sepolia.blockscout.com/tx/${hash}`}
                  >
                    Blockscout
                  </Link>
                </p>
              </div>
            )}
            {isConfirming && <p>Waiting for confirmation...</p>}
            {isConfirmed && <p>Transaction confirmed.</p>}
            {error && <p>Error: {(error as BaseError).message}</p>}
          </>
        ) : (
          <Button disabled>Please connect your wallet to continue</Button>
        )}
      </Card>
    </div>
    )}
      
    </>
  );
};

export default AirdropperNftUserPage;
