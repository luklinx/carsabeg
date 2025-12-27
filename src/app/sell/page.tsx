// src/app/sell/page.tsx
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