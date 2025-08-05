import { NextResponse } from "next/server";
import { getAllMedia } from "@/lib/store-utils";

export async function GET() {
  const media = await getAllMedia();
  return NextResponse.json(media);
}
