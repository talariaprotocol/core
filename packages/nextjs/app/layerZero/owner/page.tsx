"use client";

import {ethers} from "ethers";
import React, { useState } from "react";
import Link from "next/link";
import {layerZeroBridgeAddress} from "~~/contracts/addresses";
import AddressFreeBridgeAbi from "../../../contracts-data/deployments/optimismSepolia/AddressFreeBridge.json";
import { CheckIcon, CircleDotDashedIcon, ClockIcon, CopyIcon, TimerIcon } from "lucide-react";
import { Address, Hash, formatUnits, parseUnits } from "viem";
import { erc20Abi } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import { useAccount } from "wagmi";
import { useWriteContract } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import ShareCode from "~~/components/ui/share-code";
import { useToast } from "~~/components/ui/use-toast";
import { generateTransfer } from "~~/contracts-data/helpers/helpers";
import { OptimismSepoliaChainId } from "~~/contracts/addresses";
import { compressEncryptAndEncode } from "~~/helper";
import useTokenBalance from "~~/hooks/useTokenBalance";
import { TransactionExplorerBaseUrl } from "~~/utils/explorer";
import { BASE_URL } from "~~/constants";

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
    message: "Approve funds",
  },
  [TxStepsEnum.GENERATE_CODES]: {
    id: TxStepsEnum.GENERATE_CODES,
    status: TxStatusEnum.NOT_STARTED,
    message: "Generate Tornado Codes",
  },
  [TxStepsEnum.CREATE]: {
    id: TxStepsEnum.CREATE,
    status: TxStatusEnum.NOT_STARTED,
    message: "Create Giftcard",
  },
};

const GiftCardOwnerLayerZeroPage = () => {
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
  const [amount, setAmount] = useState("");
  const [compressObject, setCompressObject] = useState("");
  const { isLoading: isLoadingApproval, isSuccess: isSuccessApproval } = useWaitForTransactionReceipt({
    hash: approvalHash,
  });
  const { isLoading: isLoadingCreate, isSuccess: isSuccessCreate } = useWaitForTransactionReceipt({
    hash: createGiftcardHash,
  });
  const chainId = account.chainId || OptimismSepoliaChainId;
  const tokenAddress = layerZeroBridgeAddress[chainId];
  const { symbol, decimals } = useTokenBalance(tokenAddress);

  const [transactionSteps, setTransactionSteps] = useState(TX_STEPS);

  const createGiftCardCode = async (commitment: string) => {
    return await writeCreateGiftcardAsync({
      address: layerZeroBridgeAddress[chainId],
      account: account.address,
      abi: AddressFreeBridgeAbi.abi,
      functionName: "createBridge",
      args: [commitment, [], "dummy data"],
      value: ethers.parseEther(amount),
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
    const parsedNumber = Number(amount);
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
      sourceChainId: chainId,
      ownerAddress: account.address,
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
    } finally {
      console.log("isPendingCreateGiftcard", isPendingCreateGiftcard);
      console.log("createGiftcardError", createGiftcardError);
    }
  };

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

  //Render stuff
  return (
      <>
        <div className="flex flex-col gap-12">
          <div className="relative w-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg overflow-hidden">
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
                  <linearGradient id="paint0_linear" x1="250" y1="0" x2="250" y2="500" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fff" stopOpacity="0.5" />
                    <stop offset="1" stopColor="#fff" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Gift Card Content */}
            <div className="relative z-10 p-6 gap-8 flex flex-col justify-between">
              {/* Gift Card Title */}
              <div>
                <h2 className="text-white text-3xl font-bold">Gift Card</h2>
                <p className="text-white text-sm">A special gift just for you</p>
              </div>

              {/* Gift Card Amount */}
              <div className="text-center">
                <p className="text-white text-lg">Amount:</p>
                <p id="previewAmount" className="text-4xl font-bold text-yellow-400">
                  {amount} {symbol}
                </p>
              </div>
            </div>
            {/* Additional Decorative Element */}
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600 bg-opacity-30 rounded-full transform translate-y-16 -translate-x-16"></div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  disabled={isPendingApproval || isLoadingApproval || isSuccessApproval}
                  className="border p-2 rounded"
                  placeholder="Amount"
              />
            </div>
            {!account.isConnected ? (
                <Button disabled>Connect wallet</Button>
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
                              href={`https://testnet.layerzeroscan.com/tx/${step.txHash}`}
                          >
                            See transaction in Explorer
                          </Link>
                      )}
                    </div>
                  </div>
              );
            })}
            {compressObject && isSuccessCreate && (
                <ShareCode code={compressObject} url={`${BASE_URL}/layerZero/user/${compressObject}`} />
            )}
          </div>
        </div>
      </>
  );
};

export default GiftCardOwnerLayerZeroPage;