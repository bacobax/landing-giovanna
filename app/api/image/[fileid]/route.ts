// app/api/image/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import fs from "fs";
import { deleteImage, getImageById } from "@/lib/store-utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-expect-error: the normal type i wuld have assigned to params arg was recognized as type error by nextjs
export async function GET( _: NextRequest, { params }) {
  //   const session = await getServerSession(authOptions);
  //   if (!session) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }

  const { fileid } = await params;
  console.log({ fileid });
  const image = await getImageById(fileid); 
  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "uploads", image.src);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fileBuffer = await readFile(filePath);
  // Optionally, set the correct content type based on file extension
  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "image/jpeg", // or detect dynamically
      "Content-Disposition": `inline; fileid="${fileid}"`,
    },
  });
}

// @ts-expect-error: the normal type I would have assigned to params arg was recognized as type error by nextjs
export async function DELETE(_: NextRequest, { params }) {
  const { fileid } = await params;
  const image = await deleteImage(fileid);
  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
  const filePath = path.join(process.cwd(), "uploads", image.src);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
  try {
    fs.unlinkSync(filePath);
    return NextResponse.json({ success: true });
  
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}

// @ts-expect-error: the normal type I would have assigned to params arg was recognized as type error by nextjs
export async function PUT(request: NextRequest, { params }) {
  const { fileid } = await params;
  const image = await getImageById(fileid);
  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  } 
  const filePath = path.join(process.cwd(), "uploads", image.src);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  try {
    fs.writeFileSync(filePath, buffer);
    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json({ error: "Failed to update file" }, { status: 500 });
  }
}