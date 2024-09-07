import React from "react";
import PageHomeNavigation from "../../components/ui/page-home-navigation";
import KintoLogo from "~~/public/logos/kinto-logo.png";

const KintoHomePage = () => {
  return (
    <PageHomeNavigation
      application="kinto"
      title="Kinto WorldChampion NFT Airdrop 🇦🇷"
      logoSrc={KintoLogo}
      warningMessage={
        <p>
          These functionalities requires relative high amounts of gas due to the complexity of the logic behind.
          <br></br>
          We had difficulties with testing it due to low gas availability. 
          <br></br>
          Please follow the discussion on{" "}
          <a
            className="underline"
            href="https://discord.com/channels/554623348622098432/1275197954579370015/1281789703598772258"
          >
            ETHGlobal's Discord channel.
          </a>
        </p>
      }
      subTitle="Are you a World Champion? Celebrate with KINTO Network! If you're from Argentina, you can either create a code to offer your unique World Champion NFT or claim one by consuming a code, we will verify your country! Join the world cup champions in a new digital way!"
    />
  );
};

export default KintoHomePage;
