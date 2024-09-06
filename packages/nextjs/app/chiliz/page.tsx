import React from "react";
import PageHomeNavigation from "../../components/ui/page-home-navigation";
import ChilizLogo from "~~/public/logos/chiliz-logo.png";

const GiftcardHomePage = () => {
  return (
    <PageHomeNavigation
      application="chiliz"
      title="Chiliz BCN Token Distribution"
      logoSrc={ChilizLogo}
      subTitle="The BCN team can distribute tokens to their users simply by sharing a code. Are you a team? Create codes to send to your members! Are you a member? Enter your code to get your BCN Token instantly, with any wallet you choose."
    />
  );
};

export default GiftcardHomePage;
