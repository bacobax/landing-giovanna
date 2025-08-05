import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { getImages } from "@/lib/store-utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addImage } from "@/lib/store-utils";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { uploadBuffer } from "@/lib/drive_actions";

export async function GET(req: NextRequest) {
  const includeAll = req.nextUrl.searchParams.get("all") === "1";
  const images = await getImages(includeAll);
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const id = uuidv4();
    const alt = (formData.get('alt') as string) || file.name;
    const title = (formData.get('title') as string) || file.name;
    const description = (formData.get('description') as string) || file.name;
    const medium = (formData.get('medium') as string) || file.name;
    const year = (formData.get('year') as string) || file.name;
    const showReel = formData.get('show_reel') === 'true';
    const reelOnly = formData.get('reel_only') === 'true';

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine file extension
    const ext = path.extname(file.name).toLowerCase();
    let compressedBuffer: Buffer;
    if (ext === ".jpg" || ext === ".jpeg") {
      compressedBuffer = await sharp(buffer)
        .resize({ width: 1200 })
        .jpeg({ quality: 80 })
        .toBuffer();
    } else if (ext === ".png") {
      compressedBuffer = await sharp(buffer)
        .resize({ width: 1200 })
        .png({ quality: 80 })
        .toBuffer();
    } else if (ext === ".webp") {
      compressedBuffer = await sharp(buffer)
        .resize({ width: 1200 })
        .webp({ quality: 80 })
        .toBuffer();
    } else if (ext === ".heic") {
      // Convert HEIC to JPEG
      compressedBuffer = await sharp(buffer)
        .resize({ width: 1200 })
        .jpeg({ quality: 80 })
        .toBuffer();
    } else {
      // Default to jpeg
      compressedBuffer = await sharp(buffer)
        .resize({ width: 1200 })
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    let mimeType = "image/jpeg";
    if (ext === ".png") mimeType = "image/png";
    else if (ext === ".webp") mimeType = "image/webp";

    const driveId = await uploadBuffer(compressedBuffer, file.name, mimeType);

    await addImage({
      id,
      src: driveId,
      alt,
      title,
      description,
      medium,
      year,
      show_reel: showReel,
      reel_only: reelOnly,
    });
    return NextResponse.json({ success: true, fileId: driveId });
}