"use client";

import React from "react";
import PageHomeNavigation from "../../components/ui/page-home-navigation";
import { useSwitchChain } from "wagmi";
import { ChillizChainId } from "~~/contracts/addresses";
import ChilizLogo from "~~/public/logos/chz-token.png";

const GiftcardHomePage = () => {
  const { switchChain } = useSwitchChain();

  React.useEffect(() => {
    switchChain({
      chainId: ChillizChainId,
    });
  }, []);

  return (
    <PageHomeNavigation
      application="chiliz-ticket"
      title="Welcome to the MatchTicket Platform"
      logoSrc={ChilizLogo}
      subTitle="Get started by either creating a unique access code for an event or redeeming a code you’ve received. Whether you’re an organizer issuing tickets or a fan looking to secure your spot, we’ve made it simple and secure. TornadoCodes allows to
      distribute tickets to your users simply by sharing a code for future redemption with any wallet they choose, and add validation layers for any use case (KYC, Proof of Humanity, etc.). Easy for transfer and resale.
      The future of ticket distribution is here."
    />
  );
};

export default GiftcardHomePage;
