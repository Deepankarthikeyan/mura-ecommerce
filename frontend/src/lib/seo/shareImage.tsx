import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 };

async function loadLogoSrc(): Promise<string | null> {
  try {
    const file = await readFile(join(process.cwd(), "public/murai/mura-newlogo.png"));
    return `data:image/png;base64,${file.toString("base64")}`;
  } catch {
    try {
      const res = await fetch("https://mura-dev.netlify.app/murai/mura-newlogo.png");
      if (!res.ok) return null;
      const buf = Buffer.from(await res.arrayBuffer());
      return `data:image/png;base64,${buf.toString("base64")}`;
    } catch {
      return null;
    }
  }
}

export async function renderShareImage() {
  const logoSrc = await loadLogoSrc();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
          background: "#11080c",
          padding: "64px 80px",
        }}
      >
        {logoSrc ? (
          <img src={logoSrc} alt="" width={280} height={280} style={{ borderRadius: 24 }} />
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 680 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#cf0653",
              letterSpacing: "-1px",
              lineHeight: 1.05,
            }}
          >
            MuRa@23
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 32,
              color: "#fffde9",
              lineHeight: 1.35,
            }}
          >
            Silk, cotton, Banarasi and Kanjivaram sale sarees from Podanur, Coimbatore.
          </div>
        </div>
      </div>
    ),
    { ...SHARE_IMAGE_SIZE },
  );
}
