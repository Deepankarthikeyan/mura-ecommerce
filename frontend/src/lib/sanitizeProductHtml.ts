import DOMPurify from "isomorphic-dompurify";

/** Safe HTML for CMS/staff-authored product descriptions (TipTap output). */
export function sanitizeProductDescriptionHtml(raw: string | null | undefined): string {
  if (raw == null || typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return DOMPurify.sanitize(trimmed, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["mark"],
    ADD_ATTR: ["target", "rel"],
  });
}
