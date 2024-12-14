"use client";

import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { UserContext } from "~~/context";
import { UserStatus } from "~~/types/entities/user";

const KYCButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(UserContext);
  const handleKYCVerification = async () => {
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const kycCompleted = user?.status === UserStatus.done;
  return (
    <Button onClick={handleKYCVerification} disabled={kycCompleted || isLoading} className="w-full">
      {isLoading ? "Loading..." : kycCompleted ? "KYC Verified" : "Complete KYC Verification"}
    </Button>
  );
};

export default KYCButton;
