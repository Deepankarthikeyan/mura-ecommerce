/** Replace `{key}` placeholders in SEO template strings. Unknown keys become empty. */
export function applySeoTemplate(
  template: string | undefined,
  variables: Record<string, string | undefined>,
): string {
  if (!template?.trim()) return "";
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = variables[key];
    return value != null ? String(value).trim() : "";
  }).replace(/\s{2,}/g, " ").trim();
}

export function stripHtml(raw: string | undefined, maxLength = 160): string {
  if (!raw?.trim()) return "";
  const text = raw
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}…`;
}

export function truncateText(raw: string | undefined, maxLength = 160): string {
  const text = (raw ?? "").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}…`;
}
