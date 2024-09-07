"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "./input";
import { ZeroAddress, toBeHex, zeroPadValue } from "ethers";
import { CheckIcon, CircleDotDashedIcon, ClipboardPasteIcon, ClockIcon, LockOpenIcon } from "lucide-react";
import { Abi, Address, Client, Hash } from "viem";
import {
  useAccount,
  useClient,
  usePublicClient,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Button } from "~~/components/ui/button";
import { useToast } from "~~/components/ui/use-toast";
import { pedersenHash, stringifyBigInts } from "~~/contracts-data/helpers/helpers";
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

interface UserPageProps {
  userCode?: string;
  contractAbi: Abi | readonly unknown[];
  contractAddressMap: Record<number, Address>;
  extendedContract?: {
    // Used when a contract extends from our validator, like testFunction contract
    map: Record<number, Address>;
    abi: Abi | readonly unknown[];
  };
  contractRestrictedFunction: string;
  toastSuccessfullText: string;
  h1Title?: string;
  submitMessage?: string;
  title: string;
  subTitle: string;
  sendRecipient?: boolean;
}

const UserPage = ({
  userCode = "",
  contractAbi,
  contractAddressMap,
  extendedContract,
  contractRestrictedFunction,
  toastSuccessfullText,
  h1Title = "You have been selected",
  submitMessage = "Execute early-access function",
  title,
  subTitle,
  sendRecipient,
}: UserPageProps) => {
  const [provingKey, setProvingKey] = useState<Buffer | null>(null);
  const account = useAccount();
  const { data: hash, isPending: isPendingSendNumber, error, writeContractAsync } = useWriteContract();
  const [inputCode, setInputCode] = useState(userCode);
  const [processedCode, setProcessedCode] = useState<any>();
  const [transactionSteps, setTransactionSteps] = useState<Record<TxStepsEnum, TxStep>>({
    [TxStepsEnum.GENERATE_CODES]: {
      id: TxStepsEnum.GENERATE_CODES,
      status: TxStatusEnum.NOT_STARTED,
      message: "Generate Tornado Codes Proof",
    },
    [TxStepsEnum.SUBMIT]: {
      id: TxStepsEnum.SUBMIT,
      status: TxStatusEnum.NOT_STARTED,
      message: submitMessage,
    },
  });
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
  const { toast } = useToast();
  const chainId = account.chainId || OptimismSepoliaChainId;
  const client = useClient();
  const publicClient = usePublicClient();

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

  const submitTx = async () => {
    if (!account.address || !client || !publicClient) {
      return;
    }
    try {
      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.GENERATE_CODES]: {
          ...prev[TxStepsEnum.GENERATE_CODES],
          message: "Generating Tornado Codes Proof...",
          status: TxStatusEnum.PENDING,
        },
      }));

      // Reconstruct tree:
      const contractService = new ContractService();
      const commitments = await contractService.getPastCommitments({
        client: publicClient,
        abi: contractAbi,
        contractAddress: contractAddressMap[chainId],
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
        recipient: account.address,
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

      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.GENERATE_CODES]: {
          ...prev[TxStepsEnum.GENERATE_CODES],
          message: "Tornado Codes Proof generated!",
          status: TxStatusEnum.DONE,
        },
      }));

      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.SUBMIT]: {
          ...prev[TxStepsEnum.SUBMIT],
          message: "Submitting nullifier and executing restricted function",
          status: TxStatusEnum.PENDING,
        },
      }));

      const result = await writeContractAsync({
        address: (extendedContract?.map || contractAddressMap)[chainId],
        account: account.address,
        abi: extendedContract?.abi || contractAbi,
        functionName: contractRestrictedFunction,
        args: [
          processedCode.commitment,
          proof,
          root,
          nullifierHash,
          ...(sendRecipient ? [account.address] : []),
          ['0x'],
        ],
      });

      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.SUBMIT]: {
          ...prev[TxStepsEnum.SUBMIT],
          message: "Nullifier submited! Waiting for receipt...",
          txHash: result,
        },
      }));
    } catch (e) {
      toast({
        description: `Ups, there is an error`,
      });
      console.error("Error validating user code", e);
    }
  };

  useEffect(() => {
    if (isSuccess && transactionSteps[TxStepsEnum.SUBMIT].status !== TxStatusEnum.DONE) {
      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.SUBMIT]: {
          ...prev[TxStepsEnum.SUBMIT],
          message: "Transaction execution confirmed",
          status: TxStatusEnum.DONE,
        },
      }));

      toast({
        title: toastSuccessfullText,
      });
    }
  }, [isSuccess]);

  const explorerUrl = TransactionExplorerBaseUrl[chainId];

  return (
    <div className="flex flex-col gap-10 self-center">
      <div className="flex items-center gap-2">
        <LockOpenIcon size="32px" />
        <h1 className="text-4xl font-bold">{h1Title}</h1>
      </div>
      <div className="max-w-md w-full space-y-6 p-6 rounded-lg shadow-lg bg-card">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-muted-foreground">{subTitle}</p>
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
        <Button onClick={submitTx} disabled={isLoading || isSuccess || !account.isConnected} className="w-full">
          {isPendingSendNumber ? "Pending, please check your wallet..." : "Submit code & Execute transaction"}
        </Button>

        {TransactionStepsOrder.map(status => {
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
        })}
      </div>
    </div>
  );
};

export default UserPage;
