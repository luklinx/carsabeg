// src/app/dashboard/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabaseServer";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return <>{children}</>; 
}
