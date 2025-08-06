// app/api/image/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getVideoById, updateVideo, deleteVideo } from "@/lib/store-utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// @ts-expect-error: the normal type I would have assigned to params arg was recognized as type error by nextjs
export async function GET(request: NextRequest, { params }) {
  const { fileid } = params;
  const video = await getVideoById(fileid);
  if (!video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "uploads", video.src);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = request.headers.get("range");

  if (range) {
    // Parse Range header, e.g. "bytes=0-"
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
      return new NextResponse(null, {
        status: 416,
        headers: {
          "Content-Range": `bytes */${fileSize}`,
        },
      });
    }

    const chunkSize = end - start + 1;
    const fileStream = fs.createReadStream(filePath, { start, end });

    // @ts-expect-error: the normal type I would have assigned to params arg was recognized as type error by nextjs
    return new NextResponse(fileStream, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": "video/mp4",
        "Content-Disposition": `inline; fileid=\"${fileid}\"`,
      },
    });
  } else {
    // No Range header, send the whole file
    const fileStream = fs.createReadStream(filePath);
     // @ts-expect-error: the normal type I would have assigned to params arg was recognized as type error by nextjs
    return new NextResponse(fileStream, {
      status: 200,
      headers: {
        "Content-Length": fileSize.toString(),
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
        "Content-Disposition": `inline; fileid=\"${fileid}\"`,
      },
    });
  }
}

// @ts-expect-error: the normal type i would have assigned to params arg was recognized as type error by nextjs
export async function DELETE(_: NextRequest, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { fileid } = await params;
  const video = await deleteVideo(fileid);
  if (!video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }
  const filePath = path.join(process.cwd(), "uploads", video.src);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch {
      return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }
  }
  return NextResponse.json({ success: true });
}

// @ts-expect-error: the normal type i would have assigned to params arg was recognized as type error by nextjs
export async function PUT(request: NextRequest, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { fileid } = await params;
  const video = await getVideoById(fileid);
  if (!video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }
  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filePath = path.join(process.cwd(), "uploads", video.src);
  try {
    fs.writeFileSync(filePath, buffer);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update file" }, { status: 500 });
  }
}

// @ts-expect-error: the normal type i would have assigned to params arg was recognized as type error by nextjs
export async function PATCH(req: NextRequest, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { fileid } = await params;
  const existing = await getVideoById(fileid);
  if (!existing) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }
  const body = await req.json();
  const updated = {
    ...existing,
    show_reel:
      typeof body.show_reel === "boolean" ? body.show_reel : existing.show_reel,
    reel_only:
      typeof body.reel_only === "boolean" ? body.reel_only : existing.reel_only,
    title: typeof body.title === "string" ? body.title : existing.title,
    description:
      typeof body.description === "string" ? body.description : existing.description,
    alt: typeof body.alt === "string" ? body.alt : existing.alt,
    year: typeof body.year === "string" ? body.year : existing.year,
  };
  await updateVideo(updated);
  return NextResponse.json({ success: true });
}