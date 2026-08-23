"use client";

import { createContext, useCallback, useContext, useState } from "react";

type MuraiNotificationContextValue = {
  notify: (message: string) => void;
};

const MuraiNotificationContext = createContext<MuraiNotificationContextValue | null>(null);

export function MuraiNotificationProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const notify = useCallback((msg: string) => {
    setMessage(msg);
    window.setTimeout(() => setMessage(null), 3000);
  }, []);

  return (
    <MuraiNotificationContext.Provider value={{ notify }}>
      {children}
      {message ? (
        <div
          className="notification"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#cf0653",
            color: "#fff",
            padding: "16px 24px",
            borderRadius: 8,
            boxShadow: "0 4px 20px rgba(207,6,83,0.3)",
            zIndex: 10000,
            fontSize: 14,
            fontWeight: 500,
            maxWidth: 320,
          }}
        >
          {message}
        </div>
      ) : null}
    </MuraiNotificationContext.Provider>
  );
}

export function useMuraiNotify() {
  const ctx = useContext(MuraiNotificationContext);
  if (!ctx) throw new Error("useMuraiNotify must be used within MuraiNotificationProvider");
  return ctx.notify;
}
