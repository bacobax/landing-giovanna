// app/api/image/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { deleteImage, getImageById } from "@/lib/store-utils";
import { downloadStream, deleteFile as deleteDriveFile, updateFile as updateDriveFile } from "@/lib/drive_actions";
import sharp from "sharp";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-expect-error: the normal type i wuld have assigned to params arg was recognized as type error by nextjs
export async function GET(_: NextRequest, { params }) {
  const { fileid } = await params;
  const image = await getImageById(fileid);
  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  try {
    const stream = await downloadStream(image.src);
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const fileBuffer = Buffer.concat(chunks);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `inline; fileid="${fileid}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });
  }
}

// @ts-expect-error: the normal type I would have assigned to params arg was recognized as type error by nextjs
export async function DELETE(_: NextRequest, { params }) {
  const { fileid } = await params;
  const image = await deleteImage(fileid);
  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
  try {
    await deleteDriveFile(image.src);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}

// @ts-expect-error: the normal type I would have assigned to params arg was recognized as type error by nextjs
export async function PUT(request: NextRequest, { params }) {
  const { fileid } = await params;
  const image = await getImageById(fileid);
  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  let buffer = Buffer.from(arrayBuffer);
  const ext = path.extname(file.name).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") {
    buffer = await sharp(buffer).resize({ width: 1200 }).jpeg({ quality: 80 }).toBuffer();
  } else if (ext === ".png") {
    buffer = await sharp(buffer).resize({ width: 1200 }).png({ quality: 80 }).toBuffer();
  } else if (ext === ".webp") {
    buffer = await sharp(buffer).resize({ width: 1200 }).webp({ quality: 80 }).toBuffer();
  } else if (ext === ".heic") {
    buffer = await sharp(buffer).resize({ width: 1200 }).jpeg({ quality: 80 }).toBuffer();
  } else {
    buffer = await sharp(buffer).resize({ width: 1200 }).jpeg({ quality: 80 }).toBuffer();
  }
  let mimeType = "image/jpeg";
  if (ext === ".png") mimeType = "image/png";
  else if (ext === ".webp") mimeType = "image/webp";
  try {
    await updateDriveFile(image.src, buffer, mimeType);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update file" }, { status: 500 });
  }
}