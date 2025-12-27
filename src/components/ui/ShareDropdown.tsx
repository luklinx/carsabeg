"use client";

import { useEffect, useRef, useState } from "react";
import { Share2, MessageCircle, Copy } from "lucide-react";
import type { ReactNode } from "react";

interface Item {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick: (e?: React.MouseEvent) => void;
}

interface Props {
  className?: string;
  pageUrl?: string;
  items?: Item[]; // override default items
  compact?: boolean;
}

export default function ShareDropdown({
  className = "",
  pageUrl,
  items,
  compact = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const focusedIndex = useRef<number>(0);

  const url =
    typeof window !== "undefined"
      ? pageUrl || window.location.href
      : pageUrl || "";

  // default actions
  const defaultItems: Item[] = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: <MessageCircle size={14} />,
      onClick: (e) => {
        e?.stopPropagation();
        const text = encodeURIComponent(`Check out this listing: ${url}`);
        window.open(`https://wa.me/?text=${text}`, "_blank");
      },
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: <Share2 size={14} />,
      onClick: (e) => {
        e?.stopPropagation();
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
      },
    },
    {
      key: "copy",
      label: "Copy link",
      icon: <Copy size={14} />,
      onClick: async (e) => {
        e?.stopPropagation();
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // ignore
        }
      },
    },
  ];

  const menuItems = items && items.length > 0 ? items : defaultItems;

  // Close on outside click
  useEffect(() => {
    function handleDown(e: MouseEvent) {
      if (!open) return;
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, [open]);

  // Keyboard navigation & focus trap
  useEffect(() => {
    if (!open) return;

    // Focus first item when opened
    focusedIndex.current = 0;
    setTimeout(() => itemRefs.current[0]?.focus(), 0);

    function onKey(e: KeyboardEvent) {
      if (!open) return;
      const len = menuItems.length;

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        focusedIndex.current = (focusedIndex.current + 1) % len;
        itemRefs.current[focusedIndex.current]?.focus();
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        focusedIndex.current = (focusedIndex.current - 1 + len) % len;
        itemRefs.current[focusedIndex.current]?.focus();
        return;
      }

      if (e.key === "Tab") {
        // trap focus inside menu
        const { activeElement } = document;
        const firstEl = itemRefs.current[0];
        const lastEl = itemRefs.current[len - 1];
        if (!e.shiftKey && activeElement === lastEl) {
          e.preventDefault();
          firstEl?.focus();
        } else if (e.shiftKey && activeElement === firstEl) {
          e.preventDefault();
          lastEl?.focus();
        }
      }

      if (e.key === "Enter") {
        // activate focused item
        const idx = focusedIndex.current;
        if (menuItems[idx]) {
          e.preventDefault();
          (menuItems[idx].onClick as (e?: React.MouseEvent) => void)();
          setOpen(false);
          triggerRef.current?.focus();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, menuItems]);

  return (
    <div className={className}>
      <div className="relative">
        <button
          ref={triggerRef}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((s) => !s);
          }}
          aria-haspopup="menu"
          aria-expanded={open}
          className={
            compact
              ? "inline-flex items-center gap-2 bg-white text-gray-900 border border-gray-200 px-2 py-1 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              : "inline-flex items-center gap-3 bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-md shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-emerald-500"
          }
        >
          {compact ? <Share2 size={14} /> : <Share2 size={18} />}{" "}
          <span className="font-semibold text-sm">Share</span>
        </button>

        {open && (
          <div
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
            role="menu"
            className="absolute left-0 top-full mt-0.5 bg-white shadow-xl rounded-lg p-3 flex flex-col gap-2 w-48 z-50"
          >
            {menuItems.map((it, i) => (
              <button
                key={it.key}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                onClick={(e) => {
                  it.onClick(e);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                onFocus={() => (focusedIndex.current = i)}
                role="menuitem"
                className="inline-flex items-center gap-3 text-gray-900 text-sm px-3 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                <span className="text-gray-700">{it.icon}</span>
                <span className="flex-1 text-sm">
                  {it.key === "copy" && copied ? "Copied" : it.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
