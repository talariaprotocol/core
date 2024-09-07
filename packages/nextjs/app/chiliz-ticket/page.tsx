import React from "react";
import PageHomeNavigation from "../../components/ui/page-home-navigation";
import ChilizLogo from "~~/public/logos/chz-token.png";

const GiftcardHomePage = () => {
  return (
    <PageHomeNavigation
      application="chiliz-ticket"
      title="Welcome to the MatchTicket Platform"
      logoSrc={ChilizLogo}
      subTitle="Get started by either creating a unique access code for an event or redeeming a code you’ve received. Whether you’re an organizer issuing tickets or a fan looking to secure your spot, we’ve made it simple and secure. Choose an option to begin!"
    />
  );
};

export default GiftcardHomePage;
