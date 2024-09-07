"use client";

import React, { useState } from "react";
import Link from "next/link";
import MatchTicketAbi from "../../../contracts-data/deployments/chilizSpicy/MatchTicket.json";
import MatchTicketAirdropperAbi from "../../../contracts-data/deployments/chilizSpicy/MatchTicketAirdropper.json";
import { CheckIcon, CircleDotDashedIcon, ClockIcon, CopyIcon, TagIcon, TicketIcon, TimerIcon } from "lucide-react";
import { Address, Hash, formatUnits, parseUnits } from "viem";
import { erc20Abi } from "viem";
import { useReadContract, useReadContracts, useWaitForTransactionReceipt } from "wagmi";
import { useAccount } from "wagmi";
import { useWriteContract } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import ShareCode from "~~/components/ui/share-code";
import { useToast } from "~~/components/ui/use-toast";
import { BASE_URL } from "~~/constants";
import { generateTransfer } from "~~/contracts-data/helpers/helpers";
import {
  MatchTicketAirdropperAddress,
  MatchTicketERC1155Address,
  OptimismSepoliaChainId,
} from "~~/contracts/addresses";
import { compressEncryptAndEncode } from "~~/helper";
import { TransactionExplorerBaseUrl } from "~~/utils/explorer";

enum TxStatusEnum {
  NOT_STARTED = "NOT_STARTED",
  PENDING = "PENDING",
  DONE = "DONE",
}

enum TxStepsEnum {
  APPROVE,
  GENERATE_CODES,
  CREATE,
}

const TransactionStepsOrder = [TxStepsEnum.APPROVE, TxStepsEnum.GENERATE_CODES, TxStepsEnum.CREATE];

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
  [TxStepsEnum.APPROVE]: {
    id: TxStepsEnum.APPROVE,
    status: TxStatusEnum.NOT_STARTED,
    message: "Approve Match Ticket transfer",
  },
  [TxStepsEnum.GENERATE_CODES]: {
    id: TxStepsEnum.GENERATE_CODES,
    status: TxStatusEnum.NOT_STARTED,
    message: "Generate Tornado Codes",
  },
  [TxStepsEnum.CREATE]: {
    id: TxStepsEnum.CREATE,
    status: TxStatusEnum.NOT_STARTED,
    message: "Transfer Match Ticket",
  },
};

const GiftCardOwnerPage = () => {
  const {
    data: approvalHash,
    isPending: isPendingApproval,
    writeContractAsync: writeApprovalAsync,
  } = useWriteContract();
  const {
    data: createGiftcardHash,
    isPending: isPendingCreateGiftcard,
    error: createGiftcardError,
    writeContractAsync: writeCreateGiftcardAsync,
  } = useWriteContract();
  const account = useAccount();
  const { toast } = useToast();
  const [idNft, setIdNft] = useState(0);
  const [compressObject, setCompressObject] = useState("");
  const { isLoading: isLoadingApproval, isSuccess: isSuccessApproval } = useWaitForTransactionReceipt({
    hash: approvalHash,
  });
  const { isLoading: isLoadingCreate, isSuccess: isSuccessCreate } = useWaitForTransactionReceipt({
    hash: createGiftcardHash,
  });

  const chainId = account.chainId || OptimismSepoliaChainId;

  const [transactionSteps, setTransactionSteps] = useState(TX_STEPS);

  const handleApprove = async () => {
    try {
      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.APPROVE]: {
          ...prev[TxStepsEnum.APPROVE],
          message: "Sending approval...",
          status: TxStatusEnum.PENDING,
        },
      }));
      const result = await writeApprovalAsync({
        address: MatchTicketERC1155Address[chainId],
        abi: MatchTicketAbi.abi,
        functionName: "setApprovalForAll",
        args: [MatchTicketAirdropperAddress[chainId], true],
      });

      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.APPROVE]: {
          ...prev[TxStepsEnum.APPROVE],
          message: "Approval submitted! Waiting for receipt...",
          txHash: result,
        },
      }));
    } catch (error) {
      console.log(error);
      toast({
        description: "Error submitting approval",
      });
    }
  };

  const createGiftCardCode = async (commitment: string) => {
    return await writeCreateGiftcardAsync({
      address: MatchTicketAirdropperAddress[chainId],
      account: account.address,
      abi: MatchTicketAirdropperAbi.abi,
      functionName: "createMatchTicketAirdrop",
      args: [commitment, [], BigInt(idNft), BigInt(1), BigInt(1000)],
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
    const parsedNumber = Number(idNft);
    if (isNaN(parsedNumber) || parsedNumber <= 0) {
      alert("Please enter a valid number");
      return;
    }
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
          message: "Submitting commitment and creating Giftcard...",
          status: TxStatusEnum.PENDING,
        },
      }));

      const result = await createGiftCardCode(commitment);

      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.CREATE]: {
          ...prev[TxStepsEnum.CREATE],
          message: "Commitment submited! Waiting for receipt...",
          txHash: result,
        },
      }));
    } catch (e) {
      console.error("Error creating giftcard", e);
      toast({
        description: "Error submitting giftcard creation",
      });
    }
  };

  React.useEffect(() => {
    if (isSuccessApproval && transactionSteps[TxStepsEnum.APPROVE].status !== TxStatusEnum.DONE) {
      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.APPROVE]: {
          ...prev[TxStepsEnum.APPROVE],
          message: "Approval transaction confirmed",
          status: TxStatusEnum.DONE,
        },
      }));
    }
  }, [isSuccessApproval]);

  React.useEffect(() => {
    if (isSuccessCreate && transactionSteps[TxStepsEnum.CREATE].status !== TxStatusEnum.DONE) {
      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.CREATE]: {
          ...prev[TxStepsEnum.CREATE],
          message: "Giftcard creation confirmed",
          status: TxStatusEnum.DONE,
        },
      }));
    }
  }, [isSuccessCreate]);

  const explorerUrl = TransactionExplorerBaseUrl[chainId];
  // console.log("ticketCount", ticketCount);
  //Render stuff
  return (
    <>
      <div className="flex flex-col gap-12">
        <div className="max-w-sm mx-auto bg-blue-50 rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4">
          <div className="flex gap-2 items-center">
            <div className="flex justify-center w-32">
              <TagIcon className="w-24 h-24" />
            </div>
            <div className="">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Match Ticket #{idNft}</div>
              <p className="mt-2 text-gray-500">This is your match ticket Token. Below are the details:</p>
              {/* <div className="mt-4">
                <p className="text-gray-800 font-medium mt-2">
                  <span className="font-bold">Ticket Count: </span>
                  {formatUnits((ticketCount as unknown as bigint) || 0n, 18)}
                </p>
              </div> */}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Input
              id="nftId"
              type="number"
              value={idNft}
              onChange={e => setIdNft(+e.target.value)}
              disabled={isPendingApproval || isLoadingApproval || isSuccessApproval}
              className="border p-2 rounded"
              placeholder="NFT ID"
            />
          </div>
          {!account.isConnected ? (
            <Button disabled>Connect wallet</Button>
          ) : transactionSteps[TxStepsEnum.APPROVE].status === TxStatusEnum.NOT_STARTED ? (
            <Button onClick={handleApprove} disabled={isPendingApproval || isLoadingApproval || isSuccessApproval}>
              Approve
            </Button>
          ) : (
            <Button onClick={onSubmit} disabled={isPendingCreateGiftcard || isLoadingCreate || isSuccessCreate}>
              Create giftcard
            </Button>
          )}
        </div>
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
          {compressObject && isSuccessCreate && (
            <ShareCode code={compressObject} url={`${BASE_URL}/chiliz/user/${compressObject}`} />
          )}
        </div>
      </div>
    </>
  );
};

export default GiftCardOwnerPage;
