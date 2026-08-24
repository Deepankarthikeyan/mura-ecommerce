"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import type { StorefrontSettings } from "./types";
import { getEmptyStorefrontSettings, mergeStorefrontSettings } from "./defaultStorefrontSettings";
import { STOREFRONT_UPDATED_EVENT } from "./storefrontEvents";

export function useStorefrontSettings() {
  const [settings, setSettings] = useState<StorefrontSettings>(getEmptyStorefrontSettings());
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const { data } = await axios.get("/api/storefront");
      if (data?.success && data.settings) {
        setSettings(mergeStorefrontSettings(data.settings));
      }
    } catch {
      setSettings(getEmptyStorefrontSettings());
    } finally {
      setLoading(false);
    }
  };

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

    const onUpdated = (event: Event) => {
      const detail = (event as CustomEvent<StorefrontSettings>).detail;
      if (detail) {
        setSettings(mergeStorefrontSettings(detail));
      } else {
        void loadSettings();
      }
    };

    window.addEventListener(STOREFRONT_UPDATED_EVENT, onUpdated);
    return () => {
      cancelled = true;
      window.removeEventListener(STOREFRONT_UPDATED_EVENT, onUpdated);
    };
  }, []);

  return { settings, loading, reload: loadSettings };
}
