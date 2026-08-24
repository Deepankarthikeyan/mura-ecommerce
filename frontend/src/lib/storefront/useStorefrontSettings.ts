"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import type { StorefrontSettings } from "./types";
import { getEmptyStorefrontSettings, mergeStorefrontSettings } from "./defaultStorefrontSettings";

export function useStorefrontSettings() {
  const [settings, setSettings] = useState<StorefrontSettings>(getEmptyStorefrontSettings());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get("/api/storefront");
        if (!cancelled && data?.success && data.settings) {
          setSettings(mergeStorefrontSettings(data.settings));
        }
      } catch {
        if (!cancelled) setSettings(getEmptyStorefrontSettings());
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { settings, loading };
}
