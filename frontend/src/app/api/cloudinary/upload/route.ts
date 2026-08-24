import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import fs from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

export const runtime = "nodejs";

const MAX_BYTES = 50 * 1024 * 1024;

function configureCloudinary() {
  const cloudName =
    process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  return true;
}

function uploadBuffer(buffer: Buffer, folder?: string) {
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const options: Record<string, string> = {
      resource_type: "auto",
    };
    if (uploadPreset?.trim()) {
      options.upload_preset = uploadPreset.trim();
    }
    if (folder?.trim()) {
      options.folder = folder.trim();
    }

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result?.secure_url) {
        reject(error || new Error("Cloudinary upload returned no URL"));
        return;
      }
      resolve({
        secure_url: result.secure_url,
        public_id: result.public_id,
      });
    });

    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);
  });
}

async function saveLocalUpload(file: File): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(file.name) || (file.type.includes("png") ? ".png" : ".jpg");
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}${ext}`;
  const filepath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filepath, buffer);
  return `/uploads/${filename}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") ?? formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No file provided. Use form field `file`." },
        { status: 400 }
      );
    }

    const mime = file.type || "";
    if (!mime.startsWith("image/") && !mime.startsWith("video/")) {
      return NextResponse.json(
        { success: false, message: "Only image or video files are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, message: "File exceeds the 50 MB upload limit." },
        { status: 400 }
      );
    }

    if (!configureCloudinary()) {
      const url = await saveLocalUpload(file);
      return NextResponse.json({
        success: true,
        message: "File saved locally (Cloudinary not configured).",
        data: { url, id: url },
        storage: "local",
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadBuffer(buffer);

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: { url: result.secure_url, id: result.public_id },
      storage: "cloudinary",
    });
  } catch (err) {
    console.error("Upload failed:", err);
    const message =
      err instanceof Error ? err.message : "Failed to upload file";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
