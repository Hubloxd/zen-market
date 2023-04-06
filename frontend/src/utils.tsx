import { useRef, useEffect } from "react";
import { API_URL } from "./constants";

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

export function getUserInfo() {
  fetch(API_URL + "users/")
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status as unknown as string);
      }
      return response.json();
    })
    .then((response) => console.log(response))
    .catch((error) => {
      console.error(error);
    });
}
