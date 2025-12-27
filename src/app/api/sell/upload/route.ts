import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const supabase = supabaseAdmin;

  try {
    const form = await req.formData();
    const files = form.getAll("files") as File[];
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "no files" }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileExt = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = fileName;

      const { error } = await supabase.storage.from("car_images").upload(filePath, buffer, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        console.error("Server upload failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const { data: urlData } = supabase.storage.from("car_images").getPublicUrl(filePath);
      urls.push(urlData.publicUrl);
    }

    return NextResponse.json({ urls });
  } catch (err: any) {
    console.error("Upload route error:", err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
