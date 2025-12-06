"use client";
import { useEffect } from "react";

export default function ClientInit() {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && document.documentElement?.style) {
        document.documentElement.style.colorScheme = "light";
      }
    } catch (e) {
      // swallow any errors from extensions or restricted environments
      // we don't want this to crash the app
      // eslint-disable-next-line no-console
      console.warn("ClientInit failed:", e);
    }
  }, []);
  return null;
}
