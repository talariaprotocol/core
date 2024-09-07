"use client";

import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ZeroAddress, toBeHex, zeroPadValue } from "ethers";
import { KintoAccountInfo, createKintoSDK } from "kinto-web-sdk";
import { CheckIcon, CircleDotDashedIcon, ClipboardPasteIcon, ClockIcon, LockOpenIcon } from "lucide-react";
import { Abi, Address, Client, Hash, decodeErrorResult, encodeFunctionData } from "viem";
import { useDisconnect } from "wagmi";
import {
  useAccount,
  useClient,
  usePublicClient,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { useToast } from "~~/components/ui/use-toast";
import UserPage from "~~/components/ui/user-page";
import WorldChampionNFTAirdropper from "~~/contracts-data/deployments/kinto/WorldChampionNFTAirdropper.json";
import { pedersenHash, stringifyBigInts } from "~~/contracts-data/helpers/helpers";
import {
  KintoChainId,
  WorldChampionNFTAirdropperAddress,
  WorldChampionNFTContractAddress,
} from "~~/contracts/addresses";
import { OptimismSepoliaChainId } from "~~/contracts/addresses";
import { decodeDecryptAndDecompress } from "~~/helper";
import ContractService from "~~/services/contractService";
import { TransactionExplorerBaseUrl } from "~~/utils/explorer";

const snarkjs = require("snarkjs");
const path = require("path");
const crypto = require("crypto");
const MerkleTree = require("fixed-merkle-tree");
const websnarkUtils = require("websnark/src/utils");
const buildGroth16 = require("websnark/src/groth16");
const circuit = require("~~/contracts-data/helpers/withdraw.json");
const levels = 20;

const chainId = KintoChainId;

const KintoNFTUserPage = ({ params }: { params: { userCode?: string } }) => {
  const userCode = params.userCode?.[0];
  const [inputCode, setInputCode] = useState(userCode);
  const [provingKey, setProvingKey] = useState<Buffer | null>(null);
  const publicClient = usePublicClient();
  const [processedCode, setProcessedCode] = useState<any>();
  const { toast } = useToast();
  const kintoSDK = createKintoSDK(WorldChampionNFTAirdropperAddress[chainId]);
  const [kintoAccount, setKintoAccount] = React.useState<KintoAccountInfo>();

  const { disconnect } = useDisconnect();
  React.useEffect(() => {
    disconnect();
  }, []);

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
    if (!userCode) return;
    const decodedparams = decodeDecryptAndDecompress(userCode) as any;
    setProcessedCode(decodedparams);
    console.log("decodedparams", decodedparams);
  }, [inputCode]);

  const onConnect = async () => {
    const account = await kintoSDK.connect();

    if (!account || !account.exists) {
      await kintoSDK.createNewWallet();
      return;
    }

    setKintoAccount(account);
  };

  const submitTx = async () => {
    if (!publicClient || !kintoAccount || !kintoAccount.walletAddress) return;
    // if (!account.address || !client || !publicClient) {
    //   return;
    // }
    try {
      // setTransactionSteps(prev => ({
      //   ...prev,
      //   [TxStepsEnum.GENERATE_CODES]: {
      //     ...prev[TxStepsEnum.GENERATE_CODES],
      //     message: "Generating Tornado Codes Proof...",
      //     status: TxStatusEnum.PENDING,
      //   },
      // }));

      // Reconstruct tree:
      const contractService = new ContractService();
      const commitments = await contractService.getPastCommitments({
        client: publicClient,
        abi: WorldChampionNFTAirdropper.abi,
        contractAddress: WorldChampionNFTAirdropperAddress[chainId],
      });
      const tree = new MerkleTree(levels, commitments);

      const commitmentIndex = commitments.indexOf(processedCode.commitment);
      console.log("commitmentIndex", commitmentIndex);
      const { pathElements, pathIndices } = tree.path(commitmentIndex);
      const input = stringifyBigInts({
        // public
        root: tree.root(),
        nullifierHash: pedersenHash(snarkjs.bigInt(processedCode.nullifier).leInt2Buff(31)),
        relayer: ZeroAddress,
        recipient: kintoAccount.walletAddress,
        fee: 0,
        refund: 0,
        // private
        nullifier: snarkjs.bigInt(processedCode.nullifier),
        secret: snarkjs.bigInt(processedCode.secret),
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

      // setTransactionSteps(prev => ({
      //   ...prev,
      //   [TxStepsEnum.GENERATE_CODES]: {
      //     ...prev[TxStepsEnum.GENERATE_CODES],
      //     message: "Tornado Codes Proof generated!",
      //     status: TxStatusEnum.DONE,
      //   },
      // }));

      // setTransactionSteps(prev => ({
      //   ...prev,
      //   [TxStepsEnum.SUBMIT]: {
      //     ...prev[TxStepsEnum.SUBMIT],
      //     message: "Submitting nullifier and executing restricted function",
      //     status: TxStatusEnum.PENDING,
      //   },
      // }));

      // const result = await writeContractAsync({
      //   address: (extendedContract?.map || contractAddressMap)[chainId],
      //   account: account.address,
      //   abi: extendedContract?.abi || contractAbi,
      //   functionName: contractRestrictedFunction,
      //   args: [processedCode.commitment, proof, root, nullifierHash, ...(sendRecipient ? [account.address] : []), []],
      // });

      try {
        await kintoSDK.sendTransaction([
          {
            data: encodeFunctionData({
              abi: WorldChampionNFTAirdropper.abi,
              functionName: "consumeWorldChampionNFTAirdrop",
              args: [processedCode.commitment, proof, root, nullifierHash, kintoAccount.walletAddress, []],
            }),
            to: WorldChampionNFTContractAddress[chainId],
            value: 0n,
          },
        ]);
      } catch (e) {
        console.error("Error sending create transaction", e);
      }

      // setTransactionSteps(prev => ({
      //   ...prev,
      //   [TxStepsEnum.SUBMIT]: {
      //     ...prev[TxStepsEnum.SUBMIT],
      //     message: "Nullifier submited! Waiting for receipt...",
      //     txHash: result,
      //   },
      // }));
    } catch (e) {
      toast({
        description: `Ups, there is an error`,
      });
      console.error("Error validating user code", e);
    }
  };

  const explorerUrl = TransactionExplorerBaseUrl[chainId];

  // console.log("DECODED ERROR", decodeErrorResult({
  //   abi: WorldChampionNFTAirdropper.abi,
  //   data: "0x08c379a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000029416464726573733a206c6f772d6c6576656c2063616c6c20776974682076616c7565206661696c65640000000000000000000000000000000000000000000000"
  // }))

  return (
    <div className="flex flex-col gap-10 self-center">
      <div className="flex items-center gap-2">
        <LockOpenIcon size="32px" />
        <h1 className="text-4xl font-bold">Are you a World Champion?</h1>
      </div>
      <div className="max-w-md w-full space-y-6 p-6 rounded-lg shadow-lg bg-card">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold">Claim World Champion NFT</h3>
          <p className="text-muted-foreground">
            You have an NFT ready to be claimed! Enter the code and submit it to the blockchain
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="code-input" className="text-muted-foreground">
            Your proof code:
          </label>
          <div className="relative flex-1">
            <Input
              className={`overflow-ellipsis pr-12 ${inputCode ? "bg-secondary" : ""}`}
              id="code-input"
              value={inputCode}
              onChange={() => {}}
            />
            <ClipboardPasteIcon
              size="34px"
              onClick={async () => !inputCode && setInputCode(await navigator.clipboard.readText())}
              className="cursor-pointer absolute text-primary-foreground top-1/2 right-3 -translate-y-1/2 bg-primary rounded-md p-2"
            />
          </div>
        </div>
        <Button onClick={onConnect} disabled={!!kintoAccount && !!kintoAccount.walletAddress} className="w-full">
          Connect with Kinto
        </Button>
        <Button onClick={submitTx} disabled={!kintoAccount || !kintoAccount.walletAddress} className="w-full">
          Submit code & Execute transaction
        </Button>

        {/* {TransactionStepsOrder.map(status => {
          const step = transactionSteps[status];
          return (
            <div className="flex items-center gap-2" key={step.id}>
              <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-10">
                {statusIconMap[step.status]}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-900">{step.message}</p>
                {step.txHash && (
                  <Link
                    className="cursor-pointer text-xs font-light text-blue-500"
                    target="_blank"
                    href={`${explorerUrl}${step.txHash}`}
                  >
                    See transaction in Explorer
                  </Link>
                )}
              </div>
            </div>
          );
        })} */}
      </div>
    </div>
  );
};

enum TxStatusEnum {
  NOT_STARTED = "NOT_STARTED",
  PENDING = "PENDING",
  DONE = "DONE",
}

enum TxStepsEnum {
  GENERATE_CODES,
  SUBMIT,
}

const TransactionStepsOrder = [TxStepsEnum.GENERATE_CODES, TxStepsEnum.SUBMIT];

const statusIconMap: Record<TxStatusEnum, React.ReactElement> = {
  [TxStatusEnum.NOT_STARTED]: <CircleDotDashedIcon size="24px" />,
  [TxStatusEnum.PENDING]: <ClockIcon size="24px" />,
  [TxStatusEnum.DONE]: <CheckIcon size="24px" />,
};

type TxStep = {
  id: TxStepsEnum;
  status: TxStatusEnum;
  message: string;
  txHash?: Hash;
};

// interface Use

//   const account = useAccount();
//   const { data: hash, isPending: isPendingSendNumber, error, writeContractAsync } = useWriteContract();
//   const [transactionSteps, setTransactionSteps] = useState<Record<TxStepsEnum, TxStep>>({
//     [TxStepsEnum.GENERATE_CODES]: {
//       id: TxStepsEnum.GENERATE_CODES,
//       status: TxStatusEnum.NOT_STARTED,
//       message: "Generate Tornado Codes Proof",
//     },
//     [TxStepsEnum.SUBMIT]: {
//       id: TxStepsEnum.SUBMIT,
//       status: TxStatusEnum.NOT_STARTED,
//       message: submitMessage,
//     },
//   });
//   const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
//   const client = useClient();
//   const publicClient = usePublicClient();

//   useEffect(() => {
//     if (isSuccess && transactionSteps[TxStepsEnum.SUBMIT].status !== TxStatusEnum.DONE) {
//       setTransactionSteps(prev => ({
//         ...prev,
//         [TxStepsEnum.SUBMIT]: {
//           ...prev[TxStepsEnum.SUBMIT],
//           message: "Transaction execution confirmed",
//           status: TxStatusEnum.DONE,
//         },
//       }));

//       toast({
//         title: toastSuccessfullText,
//       });
//     }
//   }, [isSuccess]);

//   return (

//   );
// };

export default KintoNFTUserPage;
