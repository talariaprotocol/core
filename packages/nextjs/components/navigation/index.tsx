import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import HorizontalLogo from "~~/public/brand/Logo Files/For Web/header/horizontal.png";
import LogoSolo from "~~/public/brand/Logo Files/For Web/logo solo/Frame 3.svg";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center py-3 px-6 border-b border-gray-200 backdrop-blur-lg z-50">
      <Link href="/">
        <Image src={LogoSolo} alt="Talaria" height={35} className="md:hidden" />
        <Image src={HorizontalLogo} alt="Talaria" height={25} className="hidden md:block" />
      </Link>
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
