import { createContext, useState } from "react";
import { Selectable } from "kysely";
import { UserTable } from "~~/repository/user/user.table";

interface User extends Selectable<UserTable> {
  creditLimit?: bigint;
}

interface UserContext {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContext>({
  user: null,
  setUser: () => {},
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export { UserProvider, UserContext };
