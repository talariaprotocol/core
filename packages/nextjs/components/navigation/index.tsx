import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import HorizontalLogo from "~~/public/brand/Logo Files/For Web/header/horizontal.png";
import LogoSolo from "~~/public/brand/Logo Files/For Web/logo solo/Frame 3.svg";

const Navigation = () => {
  return (
    <nav className="flex justify-between items-center py-3 px-6 border-b border-gray-200">
      <Image src={LogoSolo} alt="Talaria" height={35} className="md:hidden" />
      <Image src={HorizontalLogo} alt="Talaria" height={25} className="hidden md:block" />
      <ConnectButton
        showBalance={false}
        chainStatus="icon"
        accountStatus={{
          smallScreen: "address",
          largeScreen: "full",
        }}
      />
    </nav>
  );
};

export { Navigation };
