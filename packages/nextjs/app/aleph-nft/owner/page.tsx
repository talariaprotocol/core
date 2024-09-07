"use client";

import { useState } from "react";
import AlephNftDropperAbi from "~~/contracts-data/deployments/optimismSepolia/AlephNFTAirdropper.json"
import { Address, erc721Abi, parseUnits } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import { useAccount } from "wagmi";
import { useWriteContract } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { useToast } from "~~/components/ui/use-toast";
import { generateTransfer } from "~~/contracts-data/helpers/helpers";
import { AirNftContractAddress, AirNftDropperContractAddress, OptimismSepoliaChainId, polygonTestnet } from "~~/contracts/addresses";
import { compressEncryptAndEncode } from "~~/helper";

const AlephNftOwnerPage = () => {
  //SmartContract stuff
  const {
    data: approvalHash,
    isPending: isPendingApproval,
    error: approvalError,
    writeContractAsync: writeApprovalAsync,
  } = useWriteContract();
  const {
    data: createGiftcardHash,
    isPending: isPendingCreateGiftcard,
    error: createGiftcardError,
    writeContractAsync: writeCreateAlephNftAsync,
  } = useWriteContract();
  const account = useAccount();
  const { toast } = useToast();
  const [id, setId] = useState("");
  const [encryptedObject, setEncryptedObject] = useState("");
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: approvalHash });
  const { isLoading: isConfirmingCreated, isSuccess: isConfirmedCreated } = useWaitForTransactionReceipt({
    hash: createGiftcardHash,
  });
  
  const handleApprove = async () => {
    try {
      const result = await writeApprovalAsync({
        address: AirNftContractAddress[polygonTestnet] as Address,
        abi: erc721Abi,
        functionName: "approve",
        args: [AirNftDropperContractAddress[polygonTestnet], BigInt(id)],
      });
      console.log(result);
    } catch (error) {
      console.log(error);
      toast({
        description: "Error approving document",
      });
    }
  };

  const createAirdropCode = async (commitment: string) => {
    return await writeCreateAlephNftAsync({
      address: AirNftDropperContractAddress[polygonTestnet],
      account: account.address,
      abi: AlephNftDropperAbi.abi,
      functionName: "createAlephNFTAirdrop",
      args: [commitment, [], BigInt(id), BigInt(1000)],
    });
  };

  const onSubmit = async () => {
    const transfer = generateTransfer();
    const { commitment, nullifier, secret } = transfer;
    const responseObject = {
      commitment: commitment,
      nullifier: nullifier,
      secret: secret,
    };
    const compressedObject = compressEncryptAndEncode(responseObject);
    console.log(compressedObject);
    setEncryptedObject(compressedObject);
    try {
      const result = await createAirdropCode(commitment);
      console.log("ReturnedResult", result);
    } catch (e) {
      console.error("Error creating giftcard", e);
    } finally {
      console.log("createGiftcardHash", createGiftcardHash);
      console.log("isPendingCreateGiftcard", isPendingCreateGiftcard);
      console.log("createGiftcardError", createGiftcardError);
    }
  };

  //Render stuff
  return (
    <>
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
                <linearGradient id="paint0_linear" x1="250" y1="0" x2="250" y2="500" gradientUnits="userSpaceOnUse">
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
              <h2 className="text-white text-3xl font-bold">Nft</h2>
              <p className="text-white text-sm">A special Nft just for you</p>
            </div>

            {/* Gift Card Amount */}
            <div className="text-center">
              <p className="text-white text-lg">Id of the nft:</p>
              <p id="previewAmount" className="text-4xl font-bold text-yellow-400">
                {id}
              </p>
            </div>
          </div>
          {/* Additional Decorative Element */}
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600 bg-opacity-30 rounded-full transform translate-y-16 -translate-x-16"></div>
        </div>
          {isConfirmedCreated && (
        <div>
          <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto w-96 h-56 mb-8">
            <code className="font-mono">{encryptedObject}</code>
          </pre>
        </div>
          ) }
        {!isConfirmed ? (
          <div className="w-96 h-56 mb-8">
            <Input
              id="amount"
              type="string"
              value={id}
              onChange={e => setId(e.target.value)}
              className="border p-2 rounded"
              placeholder="nft"
            />
            <Button className="mt-3" onClick={handleApprove}>
              {"Aprobar Nft"}
            </Button>
          </div>
        ) : !isConfirmingCreated ? (
          !isConfirmedCreated && (
            <div className="w-96 h-56 mb-8">
              <Input
                id="amount"
                type="number"
                value={id}
                disabled={true}
                className="border p-2 rounded"
                placeholder="Amount"
              />
              <Button className="mt-3" onClick={onSubmit}>
                {"Airdrop Nft"}
              </Button>
            </div>
          ) 
        ) : (
          <div>
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto grid-cols-3">
              <code className="font-mono">Waiting for confirmation</code>
            </pre>
          </div>
        )}
      </div>
    </>
  );
};

export default AlephNftOwnerPage;
