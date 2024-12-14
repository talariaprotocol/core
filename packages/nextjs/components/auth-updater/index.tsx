"use client";

import { useContext, useEffect } from "react";
import { toast } from "../ui/use-toast";
import { useAccount } from "wagmi";
import { UserContext } from "~~/context";
import { createUserAction } from "~~/repository/user/createUser.action";

const AuthUpdater = () => {
  const account = useAccount();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const login = async () => {
      if (!account.address) return;
      const createdOrExistingUser = await createUserAction({ wallet: account.address });
      if (createdOrExistingUser) {
        setUser(createdOrExistingUser);
      } else {
        toast({
          title: "Could not create or get user",
          variant: "destructive",
        });
      }
    };

    login();
  }, [account.address]);

  return null;
};
export default AuthUpdater;
