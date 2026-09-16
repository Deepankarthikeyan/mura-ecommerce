"use client";

import { useEffect } from "react";
import { applyWebsiteAppearance } from "@/lib/theme/applyWebsiteAppearance";
import type { WebsiteTheme } from "@/lib/theme/websiteTheme";
import type { WebsiteColors } from "@/lib/theme/websiteColors";

export default function ApplyThemeOnClient({
  theme,
  colors,
}: {
  theme: WebsiteTheme;
  colors: WebsiteColors;
}) {
  useEffect(() => {
    applyWebsiteAppearance(theme, colors);
  }, [theme, colors]);
  return null;
}
