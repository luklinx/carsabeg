"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  isLoggedIn: boolean;
}

export default function BookInspectionCTA({ isLoggedIn }: Props) {
  const router = useRouter();

  function handleClick() {
    if (!isLoggedIn) {
      // redirect to signin
      router.push("/auth/signin");
      return;
    }

    // notify listeners (CarDetailClient listens and will open its modal)
    window.dispatchEvent(new CustomEvent("open-inspection"));
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex px-3 py-2 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-bold"
      aria-label="Book inspection"
    >
      Book inspection
    </button>
  );
}
