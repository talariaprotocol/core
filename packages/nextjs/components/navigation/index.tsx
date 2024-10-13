import Image from "next/image";
import Link from "next/link";
import UserDropdown from "./user-dropdown";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import HorizontalLogo from "~~/public/brand/Logo Files/For Web/header/horizontal.png";
import LogoSolo from "~~/public/brand/Logo Files/For Web/logo solo/Frame 3.svg";

const Navigation = ({ isTalariaUser }: { isTalariaUser: boolean }) => {
  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center py-3 px-6 border-b border-gray-200 backdrop-blur-lg z-50">
      {isTalariaUser ? (
        <Link href="/">
          <Image src={LogoSolo} alt="Talaria" height={35} className="md:hidden" />
          <Image src={HorizontalLogo} alt="Talaria" height={25} className="hidden md:block" />
        </Link>
      ) : (
        <div></div>
      )}
      <div className="flex gap-2">
        {isTalariaUser && <UserDropdown />}
        <ConnectButton
          showBalance={process.env.NODE_ENV === "development"}
          chainStatus="icon"
          accountStatus={{
            smallScreen: "address",
            largeScreen: "full",
          }}
        />
      </div>
    </nav>
  );
};

export { Navigation };
