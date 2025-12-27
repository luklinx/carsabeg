// src/app/api/debug/storage-check/route.ts
import { getSupabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

/**
 * Debug endpoint to check if the storage bucket exists and is accessible.
 * GET /api/debug/storage-check
 */
export async function GET() {
  try {
    const supabase = getSupabaseServer();

    // Try to list the buckets
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      return NextResponse.json({
        success: false,
        message: "Failed to list storage buckets",
        error: bucketsError.message,
      });
    }

    // Check if carsabeg-uploads bucket exists
    const uploadsExists = buckets?.some(
      (b: { name: string }) => b.name === "carsabeg-uploads"
    );

    if (!uploadsExists) {
      return NextResponse.json({
        success: false,
        message: "carsabeg-uploads bucket does not exist",
        availableBuckets: buckets?.map((b: { name: string }) => b.name) || [],
        instructions:
          "Create a new storage bucket named 'carsabeg-uploads' in your Supabase dashboard (Storage → New Bucket)",
      });
    }

    // Try to access the bucket
    const { data: files, error: filesError } = await supabase.storage
      .from("carsabeg-uploads")
      .list("", { limit: 1 });

    if (filesError) {
      return NextResponse.json({
        success: false,
        message: "carsabeg-uploads bucket exists but is not accessible",
        error: filesError.message,
        instructions:
          "Check bucket permissions and ensure service role key has storage access",
      });
    }

    return NextResponse.json({
      success: true,
      message: "carsabeg-uploads storage bucket is accessible",
      fileCount: files?.length || 0,
    });
  } catch (err) {
    console.error("Storage check error:", err);
    return NextResponse.json({
      success: false,
      message: "Error checking storage",
      error: String(err),
    });
  }
}
