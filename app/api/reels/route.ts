import { NextResponse } from "next/server";
import { getReels } from "@/lib/store-utils";

export async function GET() {
  const reels = await getReels();
  return NextResponse.json(reels);
}
