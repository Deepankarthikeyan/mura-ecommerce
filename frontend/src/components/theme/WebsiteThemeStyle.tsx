import { loadWebsiteColors } from "@/lib/theme/loadWebsiteColors";
import { loadWebsiteTheme } from "@/lib/theme/loadWebsiteTheme";
import { websiteColorsToCss } from "@/lib/theme/websiteColors";

export default async function WebsiteThemeStyle() {
  const theme = await loadWebsiteTheme();
  const colors = await loadWebsiteColors(theme);
  return (
    <style
      id="website-theme"
      dangerouslySetInnerHTML={{ __html: websiteColorsToCss(colors, theme) }}
    />
  );
}
