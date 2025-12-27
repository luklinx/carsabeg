"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type FiltersParams = {
  make?: string;
  model?: string;
  city?: string;
  state?: string;
  dealer_name?: string;
  keyword?: string;
  price_min?: number;
  price_max?: number;
  year_min?: number;
  year_max?: number;
  transmission?: string;
  fuel?: string;
  // regional/spec fields
  seller_type?: string;
  body_type?: string;
  exterior_color?: string;
  interior_color?: string;
  market?: string;
  // freeform specs are not currently filterable but stored on listings
  specs?: string;
  page?: number;
  page_size?: number;
};

export type UseFiltersOptions = {
  initial?: Partial<FiltersParams>;
  deferApply?: boolean; // when true changes are local until apply()
  syncOnMount?: boolean; // read from URL on mount
};

function sanitizeNumberField(v: unknown): number | undefined {
  if (v === null || v === undefined) return undefined;
  if (typeof v === "number")
    return Number.isFinite(v) ? (v as number) : undefined;
  const s = String(v).trim();
  if (s === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

function paramsToSearchParams(p: FiltersParams): URLSearchParams {
  const sp = new URLSearchParams();
  Object.entries(p).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    sp.set(k, String(v));
  });
  return sp;
}

function searchParamsToFilters(sp: URLSearchParams): FiltersParams {
  const mapping: Array<[keyof FiltersParams, boolean]> = [
    ["make", false],
    ["model", false],
    ["city", false],
    ["state", false],
    ["dealer_name", false],
    ["keyword", false],
    ["price_min", true],
    ["price_max", true],
    ["year_min", true],
    ["year_max", true],
    ["transmission", false],
    ["fuel", false],
    ["page", true],
    ["page_size", true],
  ];

  const out: Record<string, string | number | undefined> = {};
  for (const [key, isNumber] of mapping) {
    const raw = sp.get(String(key));
    if (raw == null) continue;
    if (isNumber) {
      const n = sanitizeNumberField(raw);
      if (n !== undefined) out[String(key)] = n;
    } else {
      out[String(key)] = raw;
    }
  }

  return out as FiltersParams;
}

export function useFilters(opts?: UseFiltersOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initial = opts?.initial ?? {};
  const deferApply = opts?.deferApply ?? true;
  const syncOnMount = opts?.syncOnMount ?? true;

  const [local, setLocal] = useState<FiltersParams>({ ...initial });
  const [applied, setApplied] = useState<FiltersParams>({ ...initial });

  // On mount sync from URL if requested
  useEffect(() => {
    if (!syncOnMount) return;
    const sp = new URLSearchParams(searchParams?.toString() ?? "");
    const parsed = searchParamsToFilters(sp);
    setLocal((s) => ({ ...s, ...parsed }));
    setApplied((a) => ({ ...a, ...parsed }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setParam = useCallback(
    <K extends keyof FiltersParams>(
      key: K,
      value: FiltersParams[K] | undefined
    ) => {
      setLocal((prev) => {
        const next: Partial<FiltersParams> = { ...prev };
        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value === "")
        ) {
          const n = next as Record<string, unknown>;
          delete n[String(key)];
        } else {
          next[key] = value as FiltersParams[K];
        }
        return next as FiltersParams;
      });
      if (!deferApply) {
        // apply immediately
        setApplied((prev) => {
          const next: Partial<FiltersParams> = { ...prev };
          if (
            value === undefined ||
            value === null ||
            (typeof value === "string" && value === "")
          ) {
            const n = next as Record<string, unknown>;
            delete n[String(key)];
          } else {
            next[key] = value as FiltersParams[K];
          }
          return next as FiltersParams;
        });
      }
    },
    [deferApply]
  );

  const clear = useCallback(() => {
    setLocal({});
    setApplied({});
  }, []);

  const apply = useCallback(
    (opts?: { replace?: boolean }) => {
      setApplied(local);
      // sync to url
      const sp = paramsToSearchParams(local);
      const path = `${window.location.pathname}?${sp.toString()}`;
      router.replace(path, { scroll: false });
      if (opts?.replace === false) {
        // no-op (we always replace for now)
      }
    },
    [local, router]
  );

  const getKey = useCallback(() => {
    // stable key for caching (exclude page by default?) include page
    const canonical = JSON.stringify({ ...applied });
    return `filters:${canonical}`;
  }, [applied]);

  const appliedSnapshot = useMemo(() => ({ ...applied }), [applied]);

  return {
    local,
    applied: appliedSnapshot,
    setParam,
    clear,
    apply,
    getKey,
  } as const;
}
