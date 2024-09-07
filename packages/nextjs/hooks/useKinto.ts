import React from "react";
import { createKintoSDK } from "kinto-web-sdk";
import { Abi, Address, Hash, encodeFunctionData, keccak256, serializeTransaction } from "viem";

export default function useKinto(appAddress: Address) {
  const [kintoSdk, setKintoSdk] = React.useState<ReturnType<typeof createKintoSDK>>();
  React.useEffect(() => {
    setKintoSdk(createKintoSDK(appAddress));
  }, []);

  return kintoSdk;
}
