"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      try {
        const hash = window.location.hash?.replace(/^#/, "") || "";
        const params = new URLSearchParams(hash);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        const redirect = searchParams?.get("redirect") ?? "/";

        if (access_token && refresh_token) {
          // Persist session into server-side cookies
          await fetch("/api/auth/set-session", {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token, refresh_token }),
          });
        }

        // Remove tokens from URL and navigate to the intended page so server
        // can read the cookies we just set.
        window.location.replace(redirect);
      } catch (err) {
        console.error("OAuth callback handling failed:", err);
        // Fallback navigation
        window.location.replace("/");
      }
    }

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">Signing you in…</div>
    </div>
  );
}
