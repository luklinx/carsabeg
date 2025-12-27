// src/app/api/debug/table-check/route.ts
import { getSupabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

/**
 * Debug endpoint to check if the users table exists and is accessible.
 * GET /api/debug/table-check
 */
export async function GET() {
  try {
    const supabase = getSupabaseServer();

    // Try to query the users table (will fail if table doesn't exist)
    const { data, error } = await supabase
      .from("users")
      .select("count", { count: "exact" })
      .limit(0);

    if (error) {
      return NextResponse.json({
        success: false,
        message: "Users table does not exist or is not accessible",
        error: error.message,
        code: error.code,
        details:
          "Please run the migration SQL from db/migrations/001_create_users_table.sql in your Supabase SQL editor",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Users table exists and is accessible",
      recordCount: data?.length || 0,
    });
  } catch (err) {
    console.error("Table check error:", err);
    return NextResponse.json({
      success: false,
      message: "Error checking table",
      error: String(err),
    });
  }
}
