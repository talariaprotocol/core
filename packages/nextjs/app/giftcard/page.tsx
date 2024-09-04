import React from "react";
import PageHomeNavigation from "../../components/ui/page-home-navigation";
import KintoLogo from "~~/public/logos/kinto-logo.png";

const GiftcardHomePage = () => {
  return <PageHomeNavigation application="giftcard" title="Giftcard" logoSrc={KintoLogo} subTitle="" />;
};

export default GiftcardHomePage;
