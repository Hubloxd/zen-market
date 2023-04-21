import { createContext, useState } from "react";

import { API_URL, UserInterface } from "../constants";
import { getCookie } from "../utils";

export async function getUserInfo(csrftoken: string): Promise<UserInterface> {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `csrftoken=${csrftoken};`,
    },
  };

  const response = await fetch(API_URL + "users/", options);
  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.status}`);
  }

  const user = await response.json();
  return user[0] as UserInterface;
}
interface UserContextType {
  user: UserInterface;
  fetchUser: () => void;
  isLogged: () => boolean;
}

export const UserContext = createContext<UserContextType>({
  user: {} as UserInterface,
  fetchUser: () => {},
  isLogged: () => {
    return false;
  },
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState({} as UserInterface);

  const fetchUser = (): void => {
    const csrftoken: string | null = getCookie("csrftoken");
    if (csrftoken) {
      getUserInfo(csrftoken)
        .then((user: UserInterface) => setUser(user))
        .catch((err: Error) => console.log(err));
    }

    if (user === ({} as UserInterface)) {
      throw new Error("fetchUser can't return undefined User");
    }
  };

  const isLogged = (): boolean => {
    fetchUser();
    if (user.username) {
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
