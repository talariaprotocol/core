import React from "react";
import PageHomeNavigation from "../../components/ui/page-home-navigation";
import MorphLogo from "~~/public/logos/morph-logo.png";

const EarlyAccessHomePage = () => {
  return (
    <PageHomeNavigation
      application="early-access"
      warningMessage={
        <p>
          We had transactions pending indeterminately while testing this feature. <br></br>Please follow the discussion on{" "}
          <a
            className="underline"
            href="https://discord.com/channels/1156486804661338162/1209591862596468786/1281634619565019218"
          >
            MorphL2's Discord channel.
          </a>
        </p>
      }
      title="MorphL2 Early Access for Protocols"
      logoSrc={MorphLogo}
      subTitle="Unlock the future with Morph Blockchain! Be the first to generate exclusive early access codes or redeem them to access unique digital experiences. Create your code, share it with others, or claim one to unlock new possibilities on the Morph Blockchain. Thanks to TornadoCodes you don't need your users' addresses beforehand, unlocking a new world of opportunities for user acquisition strategies!"
    />
  );
};

export default EarlyAccessHomePage;
