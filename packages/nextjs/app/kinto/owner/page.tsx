"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { KintoAccountInfo, createKintoSDK } from "kinto-web-sdk";
import { AwardIcon, CheckIcon, CircleDotDashedIcon, ClockIcon, CopyIcon } from "lucide-react";
import { Abi, decodeErrorResult, encodeFunctionData, erc721Abi, serializeTransaction } from "viem";
import { Address, Hash } from "viem";
import { useDisconnect, useWaitForTransactionReceipt } from "wagmi";
import { useAccount } from "wagmi";
import { useWriteContract } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import ShareCode from "~~/components/ui/share-code";
import { useToast } from "~~/components/ui/use-toast";
import { BASE_URL } from "~~/constants";
import EarlyAccessCodes from "~~/contracts-data/deployments/kinto/EarlyAccessCodes.json";
import WorldChampionNFTAirdropper from "~~/contracts-data/deployments/kinto/WorldChampionNFTAirdropper.json";
import { generateTransfer } from "~~/contracts-data/helpers/helpers";
import {
  EarlyAccessCodeAddress,
  KintoChainId,
  KintoCountryValidatorModuleAddress,
  WorldChampionNFTAirdropperAddress,
  WorldChampionNFTContractAddress,
} from "~~/contracts/addresses";
import { OptimismSepoliaChainId } from "~~/contracts/addresses";
import { compressEncryptAndEncode } from "~~/helper";
import KintoLogo from "~~/public/logos/kinto-logo.png";
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
    message: "Approve NFT",
  },
  [TxStepsEnum.GENERATE_CODES]: {
    id: TxStepsEnum.GENERATE_CODES,
    status: TxStatusEnum.NOT_STARTED,
    message: "Generate Tornado Codes",
  },
  [TxStepsEnum.CREATE]: {
    id: TxStepsEnum.CREATE,
    status: TxStatusEnum.NOT_STARTED,
    message: "Create World Champion NFT Airdrop",
  },
};

const chainId = KintoChainId;

const KintoNFTOwnerPage = () => {
  const { disconnect } = useDisconnect();

  React.useEffect(() => {
    disconnect();
  }, []);

  const [kintoAccount, setKintoAccount] = React.useState<KintoAccountInfo>();
  const kintoSDK = createKintoSDK(WorldChampionNFTAirdropperAddress[chainId]);
  const nftAirdropperAddress = WorldChampionNFTAirdropperAddress[chainId];
  const nftAddress = WorldChampionNFTContractAddress[chainId];

  const onConnect = async () => {
    const account = await kintoSDK.connect();

    if (!account || !account.exists) {
      await kintoSDK.createNewWallet();
      return;
    }

    setKintoAccount(account);
  };

  const onApprove = async () => {
    try {
      const approvalResult = await kintoSDK.sendTransaction([
        {
          data: encodeFunctionData({
            abi: erc721Abi,
            functionName: "approve",
            args: [WorldChampionNFTAirdropperAddress[chainId], BigInt(idNFT)],
          }),
          to: WorldChampionNFTContractAddress[chainId],
          value: 0n,
        },
      ]);

      console.log("approvalResult", approvalResult);
    } catch (e) {
      console.error("Failed to approve", e);
    }
  };

  const onCreate = async (commitment: string) => {
    try {
      await kintoSDK.sendTransaction([
        {
          data: encodeFunctionData({
            abi: WorldChampionNFTAirdropper.abi,
            functionName: "createWorldChampionNFTAirdrop",
            args: [commitment, [KintoCountryValidatorModuleAddress], BigInt(idNFT), BigInt(1000)],
          }),
          to: WorldChampionNFTAirdropperAddress[chainId],
          value: 0n,
        },
      ]);
    } catch (e) {
      console.error("Error sending create transaction", e);
    }
  };

  const { toast } = useToast();
  const [idNFT, setIdNFT] = useState("");
  const [compressObject, setCompressObject] = useState("");

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

      // Send approval
      await onApprove();

      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.APPROVE]: {
          ...prev[TxStepsEnum.APPROVE],
          // message: "Approval submitted! Waiting for receipt...",
          message: "Approval submitted!",

          // txHash: result,
        },
      }));
    } catch (error) {
      console.log(error);
      toast({
        description: "Error submitting approval",
      });
    }
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
    const parsedNumber = Number(idNFT);
    if (isNaN(parsedNumber) || parsedNumber <= 0) {
      alert("Please enter a valid id");
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
          message: "Submitting commitment and creating NFT Airdrop...",
          status: TxStatusEnum.PENDING,
        },
      }));

      // Approve and Create NFT Airdrop
      await onCreate(commitment);

      setTransactionSteps(prev => ({
        ...prev,
        [TxStepsEnum.CREATE]: {
          ...prev[TxStepsEnum.CREATE],
          message: "Commitment submited! Waiting for receipt...",
          // txHash: result,
        },
      }));
    } catch (e) {
      console.error("Error creating NFT Airdrop", e);
      toast({
        description: "Error submitting NFT Airdrop creation",
      });
    }
  };

  // React.useEffect(() => {
  //   if (isSuccessApproval && transactionSteps[TxStepsEnum.APPROVE].status !== TxStatusEnum.DONE) {
  //     setTransactionSteps(prev => ({
  //       ...prev,
  //       [TxStepsEnum.APPROVE]: {
  //         ...prev[TxStepsEnum.APPROVE],
  //         message: "Approval transaction confirmed",
  //         status: TxStatusEnum.DONE,
  //       },
  //     }));
  //   }
  // }, [isSuccessApproval]);

  // React.useEffect(() => {
  //   if (isSuccessCreate && transactionSteps[TxStepsEnum.CREATE].status !== TxStatusEnum.DONE) {
  //     setTransactionSteps(prev => ({
  //       ...prev,
  //       [TxStepsEnum.CREATE]: {
  //         ...prev[TxStepsEnum.CREATE],
  //         message: "NFT Airdrop creation confirmed",
  //         status: TxStatusEnum.DONE,
  //       },
  //     }));
  //   }
  // }, [isSuccessCreate]);

  const explorerUrl = TransactionExplorerBaseUrl[chainId];

  return (
    <div className="flex flex-col gap-12 justify-center">
      <div className="flex flex-col gap-4">
        <div className="w-96 flex gap-4 items-center">
          <Image src={KintoLogo} alt="kint-logo" className="h-16 w-16" />
          <div>
            <h1>Create World Champion NFT Airdrop</h1>
            <p className="text-muted-foreground">Enter your NFT ID to get started</p>
          </div>
        </div>
        <Input
          id="nftId"
          type="number"
          value={idNFT}
          onChange={e => setIdNFT(e.target.value)}
          // disabled={isPendingApproval || isLoadingApproval || isSuccessApproval}
          disabled={!kintoAccount}
          className="border p-2 rounded"
          placeholder="NFT ID"
        />
        {!kintoAccount ? (
          <Button onClick={onConnect}>Connect Kinto Wallet</Button>
        ) : transactionSteps[TxStepsEnum.APPROVE].status === TxStatusEnum.NOT_STARTED ? (
          <Button
            onClick={handleApprove}
            // disabled={isPendingApproval || isLoadingApproval || isSuccessApproval}
          >
            Approve
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            // disabled={isPendingCreateNFTAirdrop || isLoadingCreate || isSuccessCreate}
          >
            Create NFT Airdrop
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold">Transaction status</p>
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
        {compressObject && (
          // isSuccessCreate &&
          <ShareCode code={compressObject} url={`${BASE_URL}/kinto/user/${compressObject}`} />
        )}
      </div>
    </div>
  );
};

export default KintoNFTOwnerPage;
