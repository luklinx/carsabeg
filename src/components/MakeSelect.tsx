"use client";

import React, { useState, useRef, useEffect } from "react";

export default function MakeSelect({
  name = "make",
  options = [],
  defaultValue = "",
  onChange,
  placeholder,
}: {
  name?: string;
  options?: string[];
  defaultValue?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [value, setValue] = useState(defaultValue || "");
  const [remote, setRemote] = useState<string[]>(options || []);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuery("");
  }, [open]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const q = query.trim();
    if (q.length === 0) return setRemote(options || []);

    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/makes?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!mounted) return;
        const json = await res.json();
        setRemote(json.makes || []);
      } catch (e) {
        // ignore
      }
    }, 250);

    return () => {
      mounted = false;
      controller.abort();
      clearTimeout(t);
    };
  }, [query, options]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (
        listRef.current &&
        !listRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const filtered = query ? remote : remote.length ? remote : options;

  return (
    <div className="relative">
      <input type="hidden" name={name} value={value} />

      <div className="flex">
        <div className="relative w-full">
          <input
            id={`${name}-input`}
            ref={inputRef}
            value={open ? query : value}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
              if (e.key === "Enter") {
                if (open && filtered.length > 0) {
                  setValue(filtered[0]);
                  setOpen(false);
                }
              }
            }}
            placeholder={placeholder ?? "Search make..."}
            className={`peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600`}
          />
          <label
            htmlFor={`${name}-input`}
            className={`absolute left-0 -top-3.5 text-gray-600 text-sm transition-all pointer-events-none bg-white px-1
            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-2
            peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm`}
          >
            {placeholder ?? "Make"}
          </label>
        </div>
      </div>

      {open && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1 w-full bg-white border rounded max-h-48 overflow-auto"
        >
          {filtered.length === 0 ? (
            <div className="p-2 text-sm text-gray-600">No results</div>
          ) : (
            filtered.map((opt: string) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setValue(opt);
                  onChange?.(opt);
                  setOpen(false);
                }}
                className="w-full text-left p-2 hover:bg-green-50"
              >
                {opt}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
