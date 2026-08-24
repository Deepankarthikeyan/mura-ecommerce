import type { StorefrontSettings } from "./types";

export const STOREFRONT_UPDATED_EVENT = "murai-storefront-settings-updated";

export function notifyStorefrontSettingsUpdated(settings: StorefrontSettings) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(STOREFRONT_UPDATED_EVENT, { detail: settings }));
  }
}
