// app/api/image/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import fs from "fs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-expect-error: the normal type i wuld have assigned to params arg was recognized as type error by nextjs
export async function GET( _: NextRequest, { params }) {
  //   const session = await getServerSession(authOptions);
  //   if (!session) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }
  console.log({ _ });
  const { filename } = params;

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