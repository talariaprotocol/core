import React from "react";
import PageHomeNavigation from "../../components/ui/page-home-navigation";
import KintoLogo from "~~/public/logos/kinto-logo.png";

const KintoHomePage = () => {
  return (
    <PageHomeNavigation
      application="kinto"
      title="Kinto WorldChampion NFT Airdrop"
      logoSrc={KintoLogo}
      subTitle="Are you a World Champion? Celebrate with KINTO Network! If you're from Argentina, you can either create a code to offer your unique World Champion NFT or claim one by consuming a code. Join the champions in a new digital way!"
    />
  );
};

export default KintoHomePage;
