import { NextRequest, NextResponse } from "next/server";
import { setShowReel } from "@/lib/store-utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// @ts-expect-error params type is provided by Next.js runtime
export async function PUT(req: NextRequest, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { fileid } = params;
  const body = await req.json();
  await setShowReel(fileid, !!body.show_reel);
  return NextResponse.json({ success: true });
}
