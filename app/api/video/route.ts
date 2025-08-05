import { NextResponse } from "next/server";
import { getVideos } from "@/lib/store-utils";

export async function GET() {
  const videos = await getVideos();
  return NextResponse.json(videos);
}
