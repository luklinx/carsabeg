// src/app/dashboard/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    redirect("/auth/signin");
  }

  return <>{children}</>;
}
