import { renderShareImage } from "@/lib/seo/shareImage";

export const runtime = "nodejs";
export const alt = "MuRa@23 — sale sarees from Podanur, Coimbatore";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderShareImage();
}
