import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Selectable } from "kysely";
import { ScrollTextIcon, UserRoundCogIcon } from "lucide-react";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { getWhitelistsByOwner } from "~~/repository/whitelist/getWhitelistsByOwner.action";
import { WhitelistTable } from "~~/repository/whitelist/whitelist.table";
import { trimAddress } from "~~/utils";

const UserDropdown = () => {
  const [userWhitelists, setUserWhitelists] = useState<Selectable<WhitelistTable>[]>([]);
  const { isConnected, address } = useAccount();
  const [prevAddress, setPrevAddress] = useState<Address | undefined>();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async (walletAddress: Address) => {
      const whitelists = await getWhitelistsByOwner({ owner: walletAddress });
      setUserWhitelists(whitelists);
    };

    if (isConnected && address && address.toLowerCase() !== prevAddress) {
      setPrevAddress(address);
      fetchData(address);
    }
  }, [isConnected, address]);

  if (!isConnected || !address || userWhitelists.length === 0) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <UserRoundCogIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Your whitelists</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup>
          {userWhitelists.map(whitelist => (
            <DropdownMenuRadioItem
              value={`${whitelist.chain_id}-${whitelist.whitelist_address}`}
              onClick={() =>
                router.push(`/whitelist/${whitelist.chain_id}/${whitelist.slug || whitelist.whitelist_address}`)
              }
            >
              <ScrollTextIcon /> {trimAddress(whitelist.whitelist_address)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
