import { Button } from "../ui/button";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { uppercaseFirstLetter } from "~~/utils";
import { walletSubstring } from "~~/utils/misc";

export interface WalletRequiredButtonProps {
  buttonIfWalletIsConnected: React.ReactNode;
  showConnectedWalletLabel?: boolean;
}

export const WalletRequiredButton: React.FC<WalletRequiredButtonProps> = ({
  buttonIfWalletIsConnected,
  showConnectedWalletLabel,
}) => {
  const { isConnected, address, chain } = useAccount();
  const { openAccountModal } = useAccountModal();
  const { openConnectModal } = useConnectModal();

  return (
    <>
      {isConnected ? (
        buttonIfWalletIsConnected
      ) : (
        <Button onClick={openConnectModal} className="w-full">
          Connect Wallet
        </Button>
      )}
      {isConnected && showConnectedWalletLabel && (
        <label
          className="text-sm text-gray-500 hover:text-blue-500 cursor-pointer transition-all"
          onClick={openAccountModal}
        >
          Using{"  "}
          {address ? walletSubstring(address) : "..."}
          {"  "} on {uppercaseFirstLetter(chain?.name ?? "")}
        </label>
      )}
    </>
  );
};
