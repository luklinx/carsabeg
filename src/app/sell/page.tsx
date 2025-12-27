// src/app/sell/page.tsx
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/serverAuth";
import SellClient from "./SellClient";

export default async function SellPage() {
  const { user } = await getServerAuth();

  if (!user) {
    redirect("/auth/signin?redirect=/sell");
  }

  return <SellClient />;
}
