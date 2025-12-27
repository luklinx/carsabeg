"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { FaqCategory, FaqItem } from "@/data/faqs";

type ExtendedFaqItem = FaqItem & { category: string; sectionTitle?: string };

type Props = {
  faqs: FaqCategory[];
};

function highlight(text: string, term: string) {
  if (!term) return text;
  const re = new RegExp(
    `(${term.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`,
    "ig"
  );
  return text.split(re).map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="bg-yellow-200 rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function FaqsClient({ faqs }: Props) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [sectionFilter, setSectionFilter] = useState<string | null>(null);
  const [popularOnly, setPopularOnly] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // small debounce for accessibility and UX
    const t = setTimeout(() => {}, 120);
    return () => clearTimeout(t);
  }, [query]);

  const flatItems: ExtendedFaqItem[] = useMemo(() => {
    return faqs.flatMap((c) =>
      c.items.map((i) => ({ ...i, category: c.id, sectionTitle: c.title }))
    );
  }, [faqs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return flatItems.filter((i) => {
      if (sectionFilter && i.category !== sectionFilter) return false;
      if (popularOnly && !i.popular) return false;
      if (!q) return true;
      return (i.q + " " + i.a).toLowerCase().includes(q);
    });
  }, [flatItems, query, sectionFilter, popularOnly]);

  useEffect(() => {
    // if only one result, open it automatically (defer to next tick to avoid cascading renders)
    if (filtered.length === 1 && openId !== filtered[0].id) {
      const id = filtered[0].id;
      const t = setTimeout(() => setOpenId(id), 0);
      return () => clearTimeout(t);
    }
    return;
  }, [filtered, openId]);

  function toggle(id: string) {
    setOpenId((s) => (s === id ? null : id));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key === "ArrowDown") {
      const next = listRef.current?.querySelectorAll('[role="button"]');
      if (next && next[idx + 1]) (next[idx + 1] as HTMLElement).focus();
      e.preventDefault();
    }
    if (e.key === "ArrowUp") {
      const next = listRef.current?.querySelectorAll('[role="button"]');
      if (next && next[idx - 1]) (next[idx - 1] as HTMLElement).focus();
      e.preventDefault();
    }
    if (e.key === "Enter" || e.key === " ") {
      (e.target as HTMLElement).click();
      e.preventDefault();
    }
  }

  const grouped = useMemo(() => {
    const map = new Map<string, ExtendedFaqItem[]>();
    filtered.forEach((item) => {
      const key = (item as ExtendedFaqItem).category || "other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item as ExtendedFaqItem);
    });
    return map;
  }, [filtered]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <label className="sr-only">Search FAQs</label>
        <div className="relative">
          <input
            ref={inputRef}
            aria-label="Search Frequently Asked Questions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in Frequently Asked Questions"
            className="w-full border rounded p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
          />
          <svg
            className="absolute left-3 top-3 text-amber-600"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z"
            />
          </svg>
        </div>

        <div className="flex gap-3 mt-3 flex-wrap">
          <button
            onClick={() => {
              setSectionFilter(null);
              setPopularOnly(false);
            }}
            className={`text-xs px-3 py-1 rounded-full ${
              !sectionFilter && !popularOnly
                ? "bg-green-600 text-white"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            All
          </button>

          <button
            onClick={() => {
              setSectionFilter(null);
              setPopularOnly(true);
            }}
            className={`text-xs px-3 py-1 rounded-full ${
              popularOnly
                ? "bg-green-600 text-white"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            Popular
          </button>

          {faqs.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSectionFilter((s) => (s === c.id ? null : c.id));
                setPopularOnly(false);
              }}
              className={`text-xs px-3 py-1 rounded-full ${
                sectionFilter === c.id
                  ? "bg-green-600 text-white"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>

      <div ref={listRef} className="space-y-4" aria-live="polite">
        {Array.from(grouped.keys()).length === 0 && (
          <div className="text-center py-8 text-sm text-amber-700">
            No results found for &ldquo;{query}&rdquo;
          </div>
        )}

        {Array.from(grouped.entries()).map(([catKey, items]) => (
          <section
            key={catKey}
            aria-labelledby={`heading-${catKey}`}
            className="bg-white rounded shadow-sm p-3"
          >
            <h3
              id={`heading-${catKey}`}
              className="text-sm font-bold text-amber-900 mb-2"
            >
              {items[0].sectionTitle || catKey}
            </h3>
            <div className="divide-y">
              {items.map((it, idx) => (
                <div key={it.id} className="py-2">
                  <div className="flex items-start justify-between gap-3">
                    <button
                      role="button"
                      aria-expanded={openId === it.id}
                      aria-controls={`faq-${it.id}`}
                      onClick={() => toggle(it.id)}
                      onKeyDown={(e) => onKeyDown(e, idx)}
                      className="text-left w-full flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-green-200"
                    >
                      <span className="flex-1 font-semibold text-amber-900">
                        {highlight(it.q, query)}
                      </span>
                      <svg
                        className={`transform transition-transform duration-200 ${
                          openId === it.id ? "rotate-180" : ""
                        }`}
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path fill="currentColor" d="M7 10l5 5 5-5z" />
                      </svg>
                    </button>
                  </div>

                  <div
                    id={`faq-${it.id}`}
                    role="region"
                    aria-labelledby={`heading-${it.id}`}
                    className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                      openId === it.id ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="pt-3 text-sm text-amber-800">
                      {highlight(it.a, query)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
