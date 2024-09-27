import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import HorizontalLogo from "~~/public/brand/Logo Files/For Web/header/horizontal.png";

const Navigation = () => {
  return (
    <nav className="flex justify-between items-center py-3 px-6 border-b border-gray-200">
      <Image src={HorizontalLogo} alt="Talaria" height={25} />
      <ConnectButton showBalance={false} chainStatus="icon" />
    </nav>
  );
};

export { Navigation };
