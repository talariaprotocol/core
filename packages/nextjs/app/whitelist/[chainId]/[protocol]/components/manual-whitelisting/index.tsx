import React, { useEffect } from "react";
import AddAddress from "./add-address";
import RemoveAddress from "./remove-address";
import { CheckIcon, Loader2 } from "lucide-react";
import { Address, isAddress } from "viem";
import { useTransactionReceipt, useWriteContract } from "wagmi";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import Collapsible from "~~/components/ui/collapsible";
import { Input } from "~~/components/ui/input";
import { useToast } from "~~/components/ui/use-toast";
import { Whitelist__factory } from "~~/contracts-data/typechain-types";

const ManualWhitelisting = ({
  whitelistAddress,
  refreshStatistics,
}: {
  whitelistAddress: Address;
  refreshStatistics: () => Promise<void>;
}) => {
  return (
    <Collapsible
      title="Manage whitelist manually"
      defaultExpanded
      children={
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p>Add user to whitelist</p>
            <AddAddress whitelistAddress={whitelistAddress} />
          </div>
          <div className="flex flex-col gap-2">
            <p>Remove user from whitelist</p>
            <RemoveAddress refreshStatistics={refreshStatistics} whitelistAddress={whitelistAddress} />
          </div>
        </div>
      }
    />
  );
};

export default ManualWhitelisting;
