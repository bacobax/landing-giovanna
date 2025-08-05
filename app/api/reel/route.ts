import { NextResponse } from "next/server";
import { getReelMedia } from "@/lib/store-utils";

export async function GET() {
  const media = await getReelMedia();
  return NextResponse.json(media);
}
