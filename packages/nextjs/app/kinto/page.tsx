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
            target="_blank"
            href="https://discord.com/channels/554623348622098432/1275197954579370015/1281789703598772258"
          >
            ETHGlobal's Discord channel
          </a>
          , see the code in {" "}
          <a
            className="underline"
            target="_blank"
            href="https://github.com/mgrabina/commit/blob/dev/packages/hardhat/contracts/modules/KintoCountryValidatorModule.sol"
          >
            GitHub
          </a>
          , the deployment on {" "}
          <a
            className="underline"
            target="_blank"
            href="https://kintoscan.io/address/0x8b392601107F3bf772C1B536CFd5748F6a036a08/contract/7887/code"
          >
            {" "}
            kintoscan.io
          </a>
          , contact us, or test the logic on any other chain.
        </p>
      }
      subTitle="Are you a World Champion? Celebrate with KINTO Network! If you're from Argentina, you can either create a code to offer your unique World Champion NFT or claim one by consuming a code, we will verify your country! Join the world cup champions in a new digital way!"
    />
  );
};

export default KintoHomePage;
