"use client";

import React, { useEffect, useRef, useState } from "react";
import CustomButton from "@/components/CustomButton";

export default function ModelSelect({
  name = "model",
  make = "",
  defaultValue = "",
  placeholder,
}: {
  name?: string;
  make?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [value, setValue] = useState(defaultValue || "");
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuery("");
    setValue(defaultValue || "");
  }, [defaultValue]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    setOptions([]);
    setQuery("");
    if (!make) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/makes/models?make=${encodeURIComponent(make)}`,
          { signal: controller.signal }
        );
        if (!mounted) return;
        if (!res.ok) {
          setOptions([]);
          return;
        }
        const json = await res.json();
        if (!mounted) return;
        setOptions(json.models || []);
      } catch (err) {
        if (!mounted) return;
        setOptions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [make]);

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

  const filtered = query
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <div className="relative">
      <input type="hidden" name={name} value={value} />
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
          placeholder={
            make
              ? placeholder ?? "Search model..."
              : placeholder ?? "Select make first"
          }
          className={`peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600`}
        />
        <label
          htmlFor={`${name}-input`}
          className={`absolute left-0 -top-3.5 text-gray-600 text-sm transition-all pointer-events-none bg-white px-1
          peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-3
          peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm`}
        >
          {placeholder ?? "Model"}
        </label>
      </div>

      {open && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1 w-full bg-white border rounded max-h-48 overflow-auto"
        >
          {loading ? (
            <div className="p-2 text-sm text-gray-600">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-2 text-sm text-gray-600">No models</div>
          ) : (
            filtered.map((opt) => (
              <CustomButton
                key={opt}
                btnType="button"
                handleClick={() => {
                  setValue(opt);
                  setOpen(false);
                }}
                containerStyles="w-full text-left p-2 hover:bg-green-50"
                title={opt}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
