import fs from "node:fs";
import path from "node:path";
import { SITE_EMAIL, SITE_NAME, SITE_PHONE } from "./brand";

export const MURA_EMAIL = {
  name: SITE_NAME,
  tagline: "India's finest sale sarees",
  email: SITE_EMAIL,
  phone: SITE_PHONE,
  addressLine1: "Podanur",
  addressLine2: "Coimbatore, Tamil Nadu 641023, India",
  primary: "#cf0653",
  primaryDark: "#a00543",
  cream: "#FFFDE9",
  beige: "#f3ece8",
  text: "#2B2A29",
  muted: "#4a4a4a",
  border: "#ededed",
  white: "#ffffff",
} as const;

const LOGO_CID = "mura-logo";

function resolveLogoPath(): string | null {
  const candidates = [
    path.join(process.cwd(), "public", "murai", "mura-newlogo.png"),
    path.join(process.cwd(), "frontend", "public", "murai", "mura-newlogo.png"),
  ];
  return candidates.find((filePath) => fs.existsSync(filePath)) ?? null;
}

export function getMuraLogoAttachments() {
  const logoPath = resolveLogoPath();
  if (!logoPath) return [];
  return [
    {
      filename: "mura-logo.png",
      path: logoPath,
      cid: LOGO_CID,
    },
  ];
}

export function muraFromAddress() {
  const from = process.env.EMAIL_USER || SITE_EMAIL;
  return `"${SITE_NAME}" <${from}>`;
}

export function wrapMuraEmail(options: {
  title: string;
  preheader?: string;
  bodyHtml: string;
}) {
  const { title, preheader = "", bodyHtml } = options;
  const hasLogo = Boolean(resolveLogoPath());
  const headerMark = hasLogo
    ? `<img src="cid:${LOGO_CID}" alt="${SITE_NAME}" width="120" style="display:block;margin:0 auto 10px auto;border:0;outline:none;" />`
    : `<p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:34px;letter-spacing:1px;color:${MURA_EMAIL.text};">MuRa<span style="color:${MURA_EMAIL.primary};">@23</span></p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${MURA_EMAIL.beige};">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${MURA_EMAIL.beige};padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:${MURA_EMAIL.white};border-radius:12px;overflow:hidden;border:1px solid ${MURA_EMAIL.border};">
          <tr>
            <td style="height:6px;background:${MURA_EMAIL.primary};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="background:${MURA_EMAIL.cream};padding:28px 32px;text-align:center;">
              ${headerMark}
              <p style="margin:0;font-family:'Segoe UI',Arial,sans-serif;font-size:11px;letter-spacing:2.4px;text-transform:uppercase;color:${MURA_EMAIL.primary};">
                ${MURA_EMAIL.tagline}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 8px 32px;font-family:'Segoe UI',Arial,sans-serif;color:${MURA_EMAIL.text};">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background:${MURA_EMAIL.text};padding:28px 32px;text-align:center;">
              <p style="margin:0 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:${MURA_EMAIL.white};">${SITE_NAME}</p>
              <p style="margin:0 0 12px 0;font-family:'Segoe UI',Arial,sans-serif;font-size:13px;line-height:1.7;color:#d4cfc8;">
                ${MURA_EMAIL.addressLine1}, ${MURA_EMAIL.addressLine2}<br />
                ${MURA_EMAIL.phone} &nbsp;·&nbsp; <a href="mailto:${MURA_EMAIL.email}" style="color:${MURA_EMAIL.cream};text-decoration:none;">${MURA_EMAIL.email}</a>
              </p>
              <p style="margin:16px 0 0 0;padding-top:16px;border-top:1px solid #444;font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#979797;">
                Handcrafted with love in India. &copy; ${new Date().getFullYear()} ${SITE_NAME}.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
