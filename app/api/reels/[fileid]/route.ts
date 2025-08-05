import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { setShowReel } from "@/lib/store-utils";

// @ts-expect-error: Next.js params typing
export async function PATCH(req: NextRequest, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fileid } = params;
  const body = await req.json();
  if (typeof body.show_reel !== "boolean") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  await setShowReel(fileid, body.show_reel);
  return NextResponse.json({ success: true });
}
