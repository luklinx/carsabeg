// src/app/api/users/upload-photo/route.ts
import { getSupabaseServer } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const photo = formData.get("photo") as File;

    if (!photo) {
      return NextResponse.json({ error: "No photo provided" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (photo.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Photo must be less than 5MB" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(photo.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, and WebP images are supported" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    // Generate unique filename
    const ext = photo.type.split("/")[1];
    const fileName = `${userId}-${Date.now()}.${ext}`;
    const filePath = `profile-photos/${fileName}`;

    // Convert File to Buffer
    const buffer = await photo.arrayBuffer();

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("carsabeg-uploads")
      .upload(filePath, buffer, {
        contentType: photo.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload photo" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from("carsabeg-uploads")
      .getPublicUrl(filePath);

    const photoUrl = publicData?.publicUrl;

    if (!photoUrl) {
      return NextResponse.json(
        { error: "Failed to generate photo URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Photo uploaded successfully",
      url: photoUrl,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
