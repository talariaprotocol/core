"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckIcon, CircleDotDashedIcon, ClockIcon, CopyIcon, FileKey2Icon, TimerIcon } from "lucide-react";
import { Hash, encodeFunctionData } from "viem";
import { usePublicClient, useWaitForTransactionReceipt } from "wagmi";
import { useAccount } from "wagmi";
import { useWriteContract } from "wagmi";
import { Button } from "~~/components/ui/button";
import ShareCode from "~~/components/ui/share-code";
import { useToast } from "~~/components/ui/use-toast";
import { BASE_URL } from "~~/constants";
import EarlyAccessCodesContractAbi from "~~/contracts-data/deployments/optimismSepolia/EarlyAccessCodes.json";
import { generateTransfer } from "~~/contracts-data/helpers/helpers";
import { EarlyAccessCodeAddress, MorphHoleskyChainId, OptimismSepoliaChainId } from "~~/contracts/addresses";
import { compressEncryptAndEncode } from "~~/helper";
import { TransactionExplorerBaseUrl } from "~~/utils/explorer";

enum TxStatusEnum {
  NOT_STARTED = "NOT_STARTED",
  PENDING = "PENDING",
  DONE = "DONE",
}

enum TxStepsEnum {
  GENERATE_CODES,
  CREATE,
}

const TransactionStepsOrder = [TxStepsEnum.GENERATE_CODES, TxStepsEnum.CREATE];

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

const TX_STEPS: Record<TxStepsEnum, TxStep> = {
  [TxStepsEnum.GENERATE_CODES]: {
    id: TxStepsEnum.GENERATE_CODES,
    status: TxStatusEnum.NOT_STARTED,
    message: "Generate Tornado Codes",
  },
  [TxStepsEnum.CREATE]: {
    id: TxStepsEnum.CREATE,
    status: TxStatusEnum.NOT_STARTED,
    message: "Create Early Access Code",
  },
};

const EarlyAccessOwnerPage = () => {
  const account = useAccount();
  const { toast } = useToast();
  const [compressObject, setCompressObject] = useState("");
  const { data: hash, isPending, error, writeContractAsync } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash: hash });

  const [transactionSteps, setTransactionSteps] = useState(TX_STEPS);

  const chainId = account.chainId || OptimismSepoliaChainId;

  const createEarlyAccessCode = async (commitment: string) => {
    return await writeContractAsync({
      address: EarlyAccessCodeAddress[chainId],
      account: account.address,
      abi: EarlyAccessCodesContractAbi.abi,
      functionName: "createEarlyAccessCode",
      args: [commitment, []],
    });
  };

  const onSubmit = async () => {
    setTransactionSteps(prev => ({
      ...prev,
      [TxStepsEnum.GENERATE_CODES]: {
        ...prev[TxStepsEnum.GENERATE_CODES],
        message: "Generating Tornado Codes...",
        status: TxStatusEnum.PENDING,
      },
    }));
    const transfer = generateTransfer();
    const { commitment, nullifier, secret } = transfer;
    const responseObject = {
      commitment: commitment,
      nullifier: nullifier,
      secret: secret,
    };
    const compressedObject = compressEncryptAndEncode(responseObject);

    // Fake delay for generating the codes:
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });

    setTransactionSteps(prev => ({
      ...prev,
      [TxStepsEnum.GENERATE_CODES]: {
        ...prev[TxStepsEnum.GENERATE_CODES],
        message: "Tornado Codes generated!",
        status: TxStatusEnum.DONE,
      },
    }));

    console.log("Sharing tornado code:", compressedObject);
    setCompressObject(compressedObject);

    try {
      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.CREATE]: {
          ...prev[TxStepsEnum.CREATE],
          message: "Submitting commitment and creating early access code...",
          status: TxStatusEnum.PENDING,
        },
      }));

      const result = await createEarlyAccessCode(commitment);

      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.CREATE]: {
          ...prev[TxStepsEnum.CREATE],
          message: "Commitment submited! Waiting for receipt...",
          txHash: result,
        },
      }));
    } catch (e) {
      console.error("Error submitting commitment", e);
      toast({
        description: "Error submitting commitment",
      });
    }
  };

  React.useEffect(() => {
    if (isSuccess && transactionSteps[TxStepsEnum.CREATE].status !== TxStatusEnum.DONE) {
      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.CREATE]: {
          ...prev[TxStepsEnum.CREATE],
          message: "Commitment successfully submited!",
          status: TxStatusEnum.DONE,
        },
      }));
    }
  }, [isSuccess]);

  const explorerUrl = TransactionExplorerBaseUrl[chainId];

  //Render stuff
  return (
    <>
      <div className="flex flex-col gap-12 w-96 self-center">
        <div className="flex flex-col gap-2 items-center">
          <FileKey2Icon size="48px" />
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Create Early Access Code</h1>
            <p className="mt-2 text-muted-foreground">Create a code and submit to the blockchain</p>
          </div>
        </div>
        {!account.isConnected ? (
          <Button disabled>Connect wallet</Button>
        ) : (
          <Button onClick={onSubmit} disabled={isPending || isLoading || isSuccess}>
            Create Code
          </Button>
        )}
        <div className="flex flex-col gap-2">
          <p className="text-lg font-bold">Transaction status</p>
          {TransactionStepsOrder.map((status, index) => {
            const step = transactionSteps[status];
            return (
              <div className="flex items-center gap-2" key={index}>
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
          {compressObject && isSuccess && (
            <ShareCode code={compressObject} url={`${BASE_URL}/morph/user/${compressObject}`} />
          )}
        </div>
      </div>
    </>
  );
};

export default EarlyAccessOwnerPage;
