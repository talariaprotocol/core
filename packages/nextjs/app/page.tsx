"use client";

import React from "react";
import Landing from "~~/components/landing";
import Divider from "~~/components/ui/divider";
import FastCreation from "~~/components/whitelist/fast-creation";
import ManualCreation from "~~/components/whitelist/manual-creation";
import useCreateWhitelist from "~~/hooks/useCreateWhitelist";

export default function CreateWhitelist() {
  const {
    handleFastCreation,
    handleManualCration,
    isCreatingWhitelist,
    isWhitelistCreated,
    createdSlug,
    isFastCreating,
    hash,
  } = useCreateWhitelist();

  return (
    <div className="flex flex-col gap-20 max-w-md">
      <div className="flex flex-col gap-6">
        <FastCreation
          handleFastCreation={handleFastCreation}
          createdSlug={createdSlug}
          isWhitelistCreated={isWhitelistCreated}
          isCreatingWhitelist={isCreatingWhitelist}
          hash={hash}
        />
        <Divider text="Or create manually" />
        <ManualCreation
          handleManualCration={handleManualCration}
          isCreatingWhitelist={isCreatingWhitelist}
          isWhitelistCreated={isWhitelistCreated}
          createdSlug={createdSlug}
          disableForm={isFastCreating}
          hash={hash}
        />
      </div>
      <Landing />
    </div>
  );
}
