"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Toast = {
  id: number;
  title?: string;
  message: string;
  type?: "info" | "success" | "error";
};

type ConfirmOpts = {
  title?: string;
  message: string;
  placeholder?: string;
  showInput?: boolean;
};

type ToastContextType = {
  showToast: (t: {
    message: string;
    title?: string;
    type?: Toast["type"];
  }) => void;
  confirm: (opts: ConfirmOpts) => Promise<boolean>;
  prompt: (opts: ConfirmOpts) => Promise<string | null>;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<
    | (ConfirmOpts & {
        open: boolean;
        _resolve?: (v: unknown) => void; // resolver can receive boolean | string | null
      })
    | null
  >(null);

  useEffect(() => {
    if (toasts.length === 0) return;
    const t = toasts[0];
    const id = window.setTimeout(() => {
      setToasts((s) => s.filter((x) => x.id !== t.id));
    }, 4000);
    return () => window.clearTimeout(id);
  }, [toasts]);

  const showToast = (t: {
    message: string;
    title?: string;
    type?: Toast["type"];
  }) => {
    setToasts((s) => [
      ...s,
      {
        id: Date.now() + Math.random(),
        title: t.title,
        message: t.message,
        type: t.type || "info",
      },
    ]);
  };

  const confirm = (opts: ConfirmOpts) => {
    return new Promise<boolean>((resolve) => {
      // store resolver as any to satisfy shared confirmState typing
      setConfirmState({
        ...opts,
        open: true,
        _resolve: resolve as (v: unknown) => void,
      });
    });
  };

  const prompt = (opts: ConfirmOpts) => {
    return new Promise<string | null>((resolve) => {
      setConfirmState({
        ...opts,
        open: true,
        showInput: true,
        _resolve: resolve as (v: unknown) => void,
      });
    });
  };

  const ctx = useMemo(() => ({ showToast, confirm, prompt }), []);

  return (
    <ToastContext.Provider value={ctx}>
      {children}

      {/* Toasts */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full rounded p-3 shadow-lg border border-white/5 text-sm text-white flex items-start gap-3 ${
              t.type === "success"
                ? "bg-green-700"
                : t.type === "error"
                ? "bg-red-700"
                : "bg-gray-800"
            }`}
          >
            <div className="flex-1">
              {t.title && <div className="font-bold">{t.title}</div>}
              <div className="mt-1">{t.message}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm / Prompt modal (single instance) */}
      {confirmState && confirmState.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative w-full max-w-lg bg-white/5 rounded-2xl p-6 text-white z-10">
            <h3 className="text-xl font-bold mb-2">
              {confirmState.title || "Confirm"}
            </h3>
            <div className="text-sm text-gray-300 mb-4">
              {confirmState.message}
            </div>
            {confirmState.showInput && (
              <input
                id="toast-prompt-input"
                className="w-full p-2 rounded bg-white/5 mb-4"
                placeholder={confirmState.placeholder || ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value;
                    confirmState._resolve?.(val);
                    setConfirmState(null);
                  }
                }}
              />
            )}
            <div className="flex items-center justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-white/5"
                onClick={() => {
                  // Resolve `null` for prompts (input), otherwise `false` for confirms
                  if (confirmState.showInput) confirmState._resolve?.(null);
                  else confirmState._resolve?.(false);
                  setConfirmState(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-green-600 font-bold"
                onClick={() => {
                  if (confirmState.showInput) {
                    const el = document.getElementById(
                      "toast-prompt-input"
                    ) as HTMLInputElement | null;
                    const val = el?.value ?? null;
                    confirmState._resolve?.(val);
                  } else {
                    confirmState._resolve?.(true);
                  }
                  setConfirmState(null);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
