import { useRef, useEffect } from "react";

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


