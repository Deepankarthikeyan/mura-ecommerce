"use client";

import { useEffect } from "react";
import { MuraiNotificationProvider } from "./MuraiNotification";
import MuraiFooter from "./MuraiFooter";
import MuraiHeader from "./MuraiHeader";
import { MuraiStyles } from "./MuraiStyles";

type MuraiLayoutProps = {
  children: React.ReactNode;
  activePage?: string;
  bodyClass?: string;
};

export default function MuraiLayout({ children, activePage, bodyClass }: MuraiLayoutProps) {
  useEffect(() => {
    document.body.classList.add("murai-storefront-active");
    document.title = document.title.includes("MuRa@23")
      ? document.title
      : "MuRa@23 — Sale Sarees Online";
    return () => {
      document.body.classList.remove("murai-storefront-active");
    };
  }, []);

  return (
    <MuraiNotificationProvider>
      <MuraiStyles />
      <div data-page={activePage ?? "home"} className={`murai-storefront ${bodyClass ?? ""}`.trim()}>
        <MuraiHeader activePage={activePage} />
        <main>{children}</main>
        <MuraiFooter />
      </div>
    </MuraiNotificationProvider>
  );
}
