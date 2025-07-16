import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { getImages } from "@/lib/store-utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";
import { addImage } from "@/lib/store-utils";
import { v4 as uuidv4 } from 'uuid';
import sharp from "sharp";

export async function GET() {
    const images = await getImages();

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
    const src = file.name;
    const alt = (formData.get('alt') as string) || file.name;
    const title = (formData.get('title') as string) || file.name;
    const description = (formData.get('description') as string) || file.name;
    const medium = (formData.get('medium') as string) || file.name;
    const year = (formData.get('year') as string) || file.name;

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

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Save file in uploads (not public)
    const uploadPath = path.join(uploadDir, file.name);
    await writeFile(uploadPath, compressedBuffer);

    await addImage({
      id,
      src,
      alt,
      title,
      description,
      medium,
      year
    });
    return NextResponse.json({ success: true, filename: file.name });
}