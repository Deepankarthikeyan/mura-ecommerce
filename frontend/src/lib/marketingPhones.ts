/** Split textarea / pasted list: newlines, commas, semicolons. Strips spaces, dedupes order. */
export function parseMarketingPhoneSegments(raw: string): string[] {
  const segments = raw
    .split(/[\n,;]+/)
    .map((s) => s.trim().replace(/\s+/g, ""))
    .filter(Boolean);
  return [...new Set(segments)];
}

/**
 * E.164-ish digits only for WhatsApp Cloud API `to` field (no +).
 * 10-digit India numbers get leading 91.
 */
export function normalizeWhatsAppToDigits(segment: string): string | null {
  let s = segment.trim().replace(/\s/g, "");
  if (!s) return null;
  let digits = s.replace(/\D/g, "");
  if (!digits) return null;
  digits = digits.replace(/^0+/, "");
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    digits = `91${digits}`;
  }
  if (digits.length < 10 || digits.length > 15) return null;
  return digits;
}

export function isValidTemplateName(name: string): boolean {
  const t = name.trim().toLowerCase();
  return /^[a-z][a-z0-9_]{0,511}$/.test(t);
}
