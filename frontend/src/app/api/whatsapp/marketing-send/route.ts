import { NextResponse } from "next/server";
import {
  parseMarketingPhoneSegments,
  normalizeWhatsAppToDigits,
  isValidTemplateName,
} from "../../../../lib/marketingPhones";
import type {
  WhatsAppTemplateHeaderImage,
  WhatsAppTemplateUrlButtonParam,
} from "../../../../functions/mongodbOperations";

function parseStringArrayParam(raw: unknown): string[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const strings = raw.filter((x): x is string => typeof x === "string");
  return strings.length > 0 ? strings : undefined;
}

function parseBodyParamsFromFormField(value: unknown): string[] | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const parsed = JSON.parse(value) as unknown;
    return parseStringArrayParam(parsed);
  } catch {
    const lines = value
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    return lines.length > 0 ? lines : undefined;
  }
}

function parseUrlButtonIndex(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.max(0, Math.floor(raw));
  }
  if (typeof raw === "string" && /^\d+$/.test(raw.trim())) {
    return Math.max(0, parseInt(raw.trim(), 10));
  }
  return 0;
}

function buildUrlButton(
  suffix: string,
  indexRaw: unknown,
  paramName: string | undefined
): WhatsAppTemplateUrlButtonParam | undefined {
  const text = suffix.trim();
  if (!text) return undefined;
  return {
    index: parseUrlButtonIndex(indexRaw),
    text,
    ...(paramName?.trim() ? { parameterName: paramName.trim() } : {}),
  };
}

const META_PARAMETER_NAME_MAX = 20;

async function runCampaign(params: {
  templateName: string;
  phoneListText: string;
  languageCode: string;
  headerImage?: WhatsAppTemplateHeaderImage;
  bodyTextParams?: string[];
  urlButton?: WhatsAppTemplateUrlButtonParam;
}) {
  const { templateName, phoneListText, languageCode, headerImage, bodyTextParams, urlButton } = params;

  const segments = parseMarketingPhoneSegments(phoneListText);
  if (segments.length === 0) {
    return NextResponse.json(
      { success: false, message: "Enter at least one phone number (one per line or comma-separated)." },
      { status: 400 }
    );
  }

  const normalized: { original: string; digits: string }[] = [];
  const invalid: string[] = [];
  for (const seg of segments) {
    const digits = normalizeWhatsAppToDigits(seg);
    if (digits) {
      normalized.push({ original: seg, digits });
    } else {
      invalid.push(seg);
    }
  }

  if (invalid.length > 0) {
    return NextResponse.json(
      {
        success: false,
        message: `Invalid phone number(s): ${invalid.slice(0, 5).join(", ")}${invalid.length > 5 ? "…" : ""}`,
        invalid,
      },
      { status: 400 }
    );
  }

  const { sendWhatsAppNamedTemplateMessage } = await import("../../../../functions/mongodbOperations");

  const results: { phone: string; success: boolean; messageId?: string; error?: string }[] = [];
  for (const { original, digits } of normalized) {
    const r = await sendWhatsAppNamedTemplateMessage({
      toDigits: digits,
      templateName,
      languageCode,
      headerImage,
      bodyTextParams,
      urlButton,
    });
    results.push({
      phone: original,
      success: r.success,
      messageId: r.messageId,
      error: r.error,
    });
  }

  const failed = results.filter((r) => !r.success);
  return NextResponse.json({
    success: failed.length === 0,
    templateName: templateName.toLowerCase(),
    sent: results.filter((r) => r.success).length,
    failed: failed.length,
    results,
  });
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let templateName = "";
    let phoneListText = "";
    let languageCode = "en";
    let headerImage: WhatsAppTemplateHeaderImage | undefined;
    let bodyTextParams: string[] | undefined;
    let urlButton: WhatsAppTemplateUrlButtonParam | undefined;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const tn = form.get("templateName");
      const pl = form.get("phoneListText");
      templateName = typeof tn === "string" ? tn.trim() : "";
      phoneListText = typeof pl === "string" ? pl : "";
      const lang = form.get("languageCode");
      if (typeof lang === "string" && lang.trim()) {
        languageCode = lang.trim();
      }

      bodyTextParams =
        parseBodyParamsFromFormField(form.get("bodyParams")) ??
        parseBodyParamsFromFormField(form.get("templateBodyParams"));

      const urlSuffixField = form.get("urlButtonSuffix");
      const urlSuffix = typeof urlSuffixField === "string" ? urlSuffixField : "";
      const urlParamField = form.get("urlButtonParameterName");
      const urlParamName = typeof urlParamField === "string" ? urlParamField : undefined;
      urlButton = buildUrlButton(urlSuffix, form.get("urlButtonIndex"), urlParamName);

      const file = form.get("headerImage");
      if (file instanceof File && file.size > 0) {
        const mime = file.type || "image/jpeg";
        if (!mime.startsWith("image/")) {
          return NextResponse.json(
            { success: false, message: "Header image must be an image file (JPEG or PNG)." },
            { status: 400 }
          );
        }
        const maxBytes = 5 * 1024 * 1024;
        if (file.size > maxBytes) {
          return NextResponse.json(
            { success: false, message: "Header image must be 5 MB or smaller." },
            { status: 400 }
          );
        }

        const { uploadWhatsAppMediaImage } = await import("../../../../functions/mongodbOperations");
        const upload = await uploadWhatsAppMediaImage({
          buffer: await file.arrayBuffer(),
          filename: file.name || "header.jpg",
          mimeType: mime,
        });
        if ("error" in upload) {
          return NextResponse.json({ success: false, message: upload.error }, { status: 502 });
        }
        headerImage = { id: upload.id };
      }
    } else {
      const body = await req.json();
      const templateNameRaw = typeof body.templateName === "string" ? body.templateName : "";
      templateName = templateNameRaw.trim();
      phoneListText = typeof body.phoneListText === "string" ? body.phoneListText : "";
      languageCode =
        typeof body.languageCode === "string" && body.languageCode.trim()
          ? body.languageCode.trim()
          : "en";

      const linkRaw = typeof body.headerImageLink === "string" ? body.headerImageLink.trim() : "";
      if (linkRaw) {
        if (!/^https:\/\//i.test(linkRaw)) {
          return NextResponse.json(
            { success: false, message: "headerImageLink must be a public https:// URL." },
            { status: 400 }
          );
        }
        headerImage = { link: linkRaw };
      }

      bodyTextParams = parseStringArrayParam(body.bodyParams);
      const urlSuffix =
        typeof body.urlButtonSuffix === "string" ? body.urlButtonSuffix : "";
      const urlParamNameJson =
        typeof body.urlButtonParameterName === "string" ? body.urlButtonParameterName : undefined;
      urlButton = buildUrlButton(urlSuffix, body.urlButtonIndex, urlParamNameJson);
    }

    if (!templateName) {
      return NextResponse.json(
        { success: false, message: "Template name is required." },
        { status: 400 }
      );
    }
    if (!isValidTemplateName(templateName)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Template name must start with a letter and contain only lowercase letters, numbers, and underscores.",
        },
        { status: 400 }
      );
    }

    if (
      urlButton?.parameterName &&
      urlButton.parameterName.length > META_PARAMETER_NAME_MAX
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `URL button "named parameter" must be at most ${META_PARAMETER_NAME_MAX} characters — use the short variable name from your Meta template (e.g. order_id), not the link or suffix.`,
        },
        { status: 400 }
      );
    }

    return runCampaign({ templateName, phoneListText, languageCode, headerImage, bodyTextParams, urlButton });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Server error";
    console.error("marketing-send:", e);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
