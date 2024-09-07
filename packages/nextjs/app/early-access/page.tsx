import React from "react";
import PageHomeNavigation from "../../components/ui/page-home-navigation";
import MorphLogo from "~~/public/logos/logo_text.svg";

const EarlyAccessHomePage = () => {
  return <PageHomeNavigation application="early-access" title="Early Access" logoSrc={MorphLogo} subTitle="Unlock the future with Morph Blockchain! Be the first to generate exclusive early access codes or redeem them to access unique digital experiences. Create your code, share it with others, or claim one to unlock new possibilities on the Morph Blockchain. Join now and be a part of the next digital revolution!" />;
};

export default EarlyAccessHomePage;
