"use client";

import { useContext, useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { UserContext } from "~~/context";
import { getUserAction } from "~~/repository/user/getUser.action";
import { UserStatus } from "~~/types/entities/user";

const AuthUpdater = () => {
  const { setUser, user } = useContext(UserContext);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    if (user && user.status !== UserStatus.done) {
      setPolling(true);
    }
  }, [user]);

  useEffect(() => {
    if (polling) {
      const interval = setInterval(async () => {
        if (!user?.wallet) return;
        const updatedUser = await getUserAction({ wallet: user.wallet });
        if (updatedUser && updatedUser.status === UserStatus.done) {
          setUser(updatedUser);
          toast({ title: "KYC Validated!" });
          clearInterval(interval);
          setPolling(false);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [polling, user?.wallet]);

  return null;
};
export default AuthUpdater;
