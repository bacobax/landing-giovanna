import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getVideos, addVideo } from "@/lib/store-utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const includeAll = req.nextUrl.searchParams.get("all") === "1";
  const videos = await getVideos(includeAll);
  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const id = uuidv4();
  const alt = (formData.get("alt") as string) || file.name;
  const title = (formData.get("title") as string) || file.name;
  const description = (formData.get("description") as string) || file.name;
  const year = (formData.get("year") as string) || new Date().getFullYear().toString();
  const showReel = formData.get("show_reel") === "true";
  const reelOnly = formData.get("reel_only") === "true";

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${id}${path.extname(file.name)}`;
  const uploadPath = path.join(process.cwd(), "uploads", filename);
  await fs.promises.writeFile(uploadPath, buffer);

  await addVideo({
    id,
    src: filename,
    alt,
    title,
    description,
    medium: "video",
    year,
    show_reel: showReel,
    reel_only: reelOnly,
  });

  return NextResponse.json({ success: true, fileId: filename });
}
