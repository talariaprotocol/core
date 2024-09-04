import React from "react";
import PageHomeNavigation from "../../components/ui/page-home-navigation";
import KintoLogo from "~~/public/logos/kinto-logo.png";

const EarlyAccessHomePage = () => {
  return <PageHomeNavigation application="early-access" title="Early Access" logoSrc={KintoLogo} subTitle="" />;
};

export default EarlyAccessHomePage;
