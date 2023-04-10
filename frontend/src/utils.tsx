import { useRef, useEffect } from "react";
import { API_URL, User } from "./constants";

export function useDocumentTitle(
  title = "Zen Market",
  prevailOnUnmount = false
) {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(
    () => () => {
      if (!prevailOnUnmount) {
        document.title = defaultTitle.current;
      }
    },
    [prevailOnUnmount]
  );
}

export function getCookie(name: string): string | null {
  const cookies = document.cookie;
  const cookieMap = new Map<string, string>();
  cookies.split(";").map((val) => {
    val = val.trim();
    let [key, v] = val.split("=");

    cookieMap.set(key, v);
    return null;
  });

  const out = cookieMap.get(name);
  return out ? out : null;
}

export async function getUserInfo(csrftoken: string): Promise<User> {
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
  return user[0] as User;
}
