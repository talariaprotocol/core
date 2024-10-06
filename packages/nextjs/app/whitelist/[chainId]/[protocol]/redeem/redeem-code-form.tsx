"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ZeroAddress, toBeHex, zeroPadValue } from "ethers";
import { CheckIcon, CircleDotDashedIcon, ClockIcon, LockOpenIcon } from "lucide-react";
import { Address, Hash } from "viem";
import { useAccount, useClient, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { useToast } from "~~/components/ui/use-toast";
import { pedersenHash, stringifyBigInts } from "~~/contracts-data/helpers/helpers";
import { Whitelist__factory } from "~~/contracts-data/typechain-types/factories/contracts/useCases/whitelist/Whitelist__factory";
import { OptimismSepoliaChainId } from "~~/contracts/addresses";
import { decodeDecryptAndDecompress } from "~~/helper";
import { contractService } from "~~/services/contractService";
import { uppercaseFirstLetter } from "~~/utils";
import { TransactionExplorerBaseUrl } from "~~/utils/explorer";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const snarkjs = require("snarkjs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require("crypto");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MerkleTree = require("fixed-merkle-tree");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const websnarkUtils = require("websnark/src/utils");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const buildGroth16 = require("websnark/src/groth16");
// eslint-disable-next-line @typescript-eslint/no-var-requires
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

const RedeemCodeForm = ({
  protocol,
  logo,
  whitelistAddress,
  ctaUrl,
}: {
  protocol: string;
  logo?: string;
  whitelistAddress: Address;
  ctaUrl?: string;
}) => {
  const [provingKey, setProvingKey] = useState<Buffer | null>(null);
  const account = useAccount();
  const { data: hash, isPending: isPendingSendNumber, error, writeContractAsync } = useWriteContract();
  const [processedCode, setProcessedCode] = useState<any>();
  const [transactionSteps, setTransactionSteps] = useState<Record<TxStepsEnum, TxStep>>({
    [TxStepsEnum.GENERATE_CODES]: {
      id: TxStepsEnum.GENERATE_CODES,
      status: TxStatusEnum.NOT_STARTED,
      message: "Generate Talaria Proof",
    },
    [TxStepsEnum.SUBMIT]: {
      id: TxStepsEnum.SUBMIT,
      status: TxStatusEnum.NOT_STARTED,
      message: "Submit nullifier in order to be whitelisted",
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
    const secretCode = encodeURIComponent(window.location.hash.slice(1));
    if (!secretCode) return;

    try {
      const decodedparams = decodeDecryptAndDecompress(secretCode) as any;
      setProcessedCode(decodedparams);
    } catch (e) {
      console.error("Error decoding params", e);
    }
  }, []);

  const submitTx = async () => {
    if (!account.address || !client || !publicClient) {
      return;
    }
    try {
      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.GENERATE_CODES]: {
          ...prev[TxStepsEnum.GENERATE_CODES],
          message: "Generating Talaria Proof...",
          status: TxStatusEnum.PENDING,
        },
      }));

      // Reconstruct tree:
      const commitments = await contractService.getPastCommitments({
        client: publicClient,
        abi: Whitelist__factory.abi,
        contractAddress: whitelistAddress,
      });
      const tree = new MerkleTree(levels, commitments);

      const commitmentIndex = commitments.indexOf(processedCode.commitment);
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

      const groth16 = await buildGroth16();
      const proofData = await websnarkUtils.genWitnessAndProve(groth16, input, circuit, provingKey?.buffer);

      const { proof } = websnarkUtils.toSolidityInput(proofData);
      const root = zeroPadValue(toBeHex(input.root), 32) as Hash;
      const nullifierHash = zeroPadValue(toBeHex(input.nullifierHash), 32) as Hash;

      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.GENERATE_CODES]: {
          ...prev[TxStepsEnum.GENERATE_CODES],
          message: "Talaria Proof generated!",
          status: TxStatusEnum.DONE,
        },
      }));

      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.SUBMIT]: {
          ...prev[TxStepsEnum.SUBMIT],
          message: "Submitting nullifier to be whitelisted",
          status: TxStatusEnum.PENDING,
        },
      }));

      // TODO: Implement contract call
      const result = await writeContractAsync({
        address: whitelistAddress,
        account: account.address,
        abi: Whitelist__factory.abi,
        functionName: "consumeEarlyAccessCode",
        args: [processedCode.commitment, proof, root, nullifierHash, account.address, [], account.address],
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
        title: "Transaction executed successfully!",
        description: `Congratulations, you are now whitelisted for ${uppercaseFirstLetter(protocol)}!`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, protocol]);

  const explorerUrl = TransactionExplorerBaseUrl[chainId];

  return (
    <div className="flex flex-col gap-10 self-center">
      <div className="flex items-center gap-2">
        <LockOpenIcon size="32px" />
        <h1 className="text-4xl font-bold">{uppercaseFirstLetter(protocol)} Whitelist</h1>
      </div>
      <div className="max-w-md w-full space-y-6 p-6 rounded-lg shadow-lg bg-card">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold">Whitelist</h3>
          <p className="text-muted-foreground">
            Submit your proof code to be whitelisted to access {uppercaseFirstLetter(protocol)}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="code-input" className="text-muted-foreground">
            Your proof code:
          </label>
          <div className="relative flex-1">
            <Input
              disabled
              className="overflow-ellipsis pr-12 bg-secondary"
              id="code-input"
              value={processedCode?.commitment}
            />
          </div>
        </div>
        <Button
          onClick={submitTx}
          disabled={isLoading || isSuccess || !account.isConnected || !provingKey}
          className="w-full"
        >
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
      {isSuccess && (
        <div className="max-w-md w-full p-6 rounded-lg shadow-lg bg-green-100 text-green-800">
          <h3 className="text-xl font-bold mb-2">🎉 Congratulations!</h3>
          <p>You are now whitelisted for {protocol}. Welcome aboard!</p>
          {ctaUrl && (
            <Button className="mt-4">
              <Link href={ctaUrl}>Go to {protocol}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default RedeemCodeForm;
