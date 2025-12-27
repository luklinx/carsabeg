import { NextResponse } from "next/server";
import { getServerAuth } from "@/lib/serverAuth";

export async function GET() {
  const { user } = await getServerAuth();
  return NextResponse.json({ user: user ?? null });
}