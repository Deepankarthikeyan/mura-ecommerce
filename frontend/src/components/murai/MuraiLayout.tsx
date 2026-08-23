"use client";

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
  return (
    <MuraiNotificationProvider>
      <MuraiStyles />
      <div data-page={activePage ?? "home"} className={bodyClass}>
        <MuraiHeader activePage={activePage} />
        <main>{children}</main>
        <MuraiFooter />
      </div>
    </MuraiNotificationProvider>
  );
}
