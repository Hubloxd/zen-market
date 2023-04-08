import { createContext, useState } from "react";

import { User } from "../constants";
import { getCookie, getUserInfo } from "../utils";

interface UserContextType {
  user: User;
  fetchUser: () => void;
  isLogged: () => boolean;
}

export const UserContext = createContext<UserContextType>({
  user: {} as User,
  fetchUser: () => {},
  isLogged: () => {
    return false;
  },
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({} as User);

  const fetchUser = (): void => {
    const csrftoken: string | null = getCookie("csrftoken");
    if (csrftoken) {
      getUserInfo(csrftoken)
        .then((user: User) => setUser(user))
        .catch((err: Error) => console.log(err));
    }

    if (user === ({} as User)) {
      throw new Error("fetchUser can't return undefined User");
    }
  };

  const isLogged = (): boolean => {
    fetchUser();
    if (user !== ({} as User)) {
      return true;
    }
    return false;
  };

  const userValue: UserContextType = {
    user,
    fetchUser,
    isLogged,
  };

  return (
    <UserContext.Provider value={userValue}>{children}</UserContext.Provider>
  );
}
