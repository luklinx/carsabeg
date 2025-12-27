"use client";

import { useEffect, useState } from "react";

interface Props {
  createdAt?: string | null;
}

export default function PostedAgo({ createdAt }: Props) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!createdAt) {
      setLabel(null);
      return;
    }
    try {
      const then = new Date(createdAt).getTime();
      const diffDays = Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) setLabel("Posted today");
      else if (diffDays === 1) setLabel("Posted 1 day ago");
      else setLabel(`Posted ${diffDays} days ago`);
    } catch (err) {
      setLabel(null);
    }
  }, [createdAt]);

  if (!label) return null;
  return <div>{label}</div>;
}
