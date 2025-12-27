"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientRedirectIfAuthed() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/check", { credentials: "include" });
        if (!mounted) return;
        if (res.ok) {
          router.replace("/dashboard");
        }
      } catch (err) {
        // ignore — not authed
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  return null;
}
