"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import {Button} from "~~/components/ui/button";
import { UserContext } from "~~/context";
import { UserStatus } from "~~/types/entities/user";

const KYCButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  const handleKYCVerification = async () => {
    setIsLoading(true);
    setIsLoading(false);
  };

  const baseUrl = 'https://signup.metamap.com/'
  const merchantToken = '675db7825a7486001d7a6a75'
  const flowId = '675db781bbbcf4001d491881'
  const wallet =  user ? user.wallet : ""
  const userId = user ? user.id : ""
  const metadata = {
    walletId: wallet,
    extraData: {
      userId: userId
    }
  }

  const url = `${baseUrl}?merchantToken=${merchantToken}&flowId=${flowId}&metadata=${encodeURIComponent(JSON.stringify(metadata))}`
  const kycCompleted = user?.status === UserStatus.done;
  return (
      <Link href={url} target="_blank" rel="noopener noreferrer">
      <Button className="w-full">
          Open KYC Verification
      </Button>
      </Link>

  )
};

export default KYCButton;
