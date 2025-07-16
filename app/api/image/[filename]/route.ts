// app/api/image/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import path from "path";
import { readFile } from "fs/promises";
import fs from "fs";
import { getImageById } from "@/lib/store-utils";

export async function GET(req: NextRequest, { params }: { params: { filename: string } }) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

  const { filename } = await params;
 
  const filePath = path.join(process.cwd(), "uploads", filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fileBuffer = await readFile(filePath);
  // Optionally, set the correct content type based on file extension
  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "image/jpeg", // or detect dynamically
      "Content-Disposition": `inline; filename="${filename}"`,
    },
  });
}