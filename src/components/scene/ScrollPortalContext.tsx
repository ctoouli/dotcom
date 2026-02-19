"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";

const ScrollPortalContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);

export function useScrollPortal() {
  return useContext(ScrollPortalContext);
}

export function ScrollPortalProvider({ children }: { children: ReactNode }) {
  const portalRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const div = document.createElement("div");
    div.setAttribute("data-scroll-portal", "true");
    div.style.cssText =
      "position:fixed;inset:0;pointer-events:none;overflow:visible;z-index:10;";
    document.body.appendChild(div);
    (portalRef as React.MutableRefObject<HTMLDivElement | null>).current = div;
    return () => {
      if (document.body.contains(div)) document.body.removeChild(div);
      (portalRef as React.MutableRefObject<HTMLDivElement | null>).current = null;
    };
  }, []);

  return (
    <ScrollPortalContext.Provider value={portalRef}>
      {children}
    </ScrollPortalContext.Provider>
  );
}
