import React from "react";
import PageHomeNavigation from "../../components/ui/page-home-navigation";
import LayerZeroLogo from "~~/public/logos/layerzero-logo.png";

const GiftcardLayerZeroHomePage = () => {
  return (
    <PageHomeNavigation
      application="layerZero"
      title="Address-Free Bridge / Cross-Chain Gift-Cards"
      logoSrc={LayerZeroLogo}
      subTitle="
        A decentralized, cross-chain gift-card solution. Send value gift-cards to anyone, anywhere, without needing to know their address or chain.
        With the security of TornadoCash and the flexibility of LayerZero, this solution is the first of its kind.
        The future of cross-chain value transfer is here.
      "
      warningMessage={
        <p>
          The v1 requires liquidity in the destination chain. We currently support Optimism and Arbitrum. New chains and
          use cases are coming soon.
        </p>
      }
    />
  );
};

export default GiftcardLayerZeroHomePage;
