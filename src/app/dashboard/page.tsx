// src/app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  if (!userId) {
    redirect("/auth/signin");
  }

  // Redirect to profile page
  redirect("/dashboard/profile");
}
