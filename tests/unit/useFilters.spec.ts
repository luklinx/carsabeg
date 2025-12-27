import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";

// Mock next/navigation hooks used in the hook
vi.mock("next/navigation", async () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(""),
}));

import { useFilters } from "@/hooks/useFilters";

describe("useFilters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with initial values", () => {
    const { result } = renderHook(() =>
      useFilters({ initial: { make: "Toyota" }, deferApply: true })
    );
    expect(result.current.local.make).toBe("Toyota");
    expect(result.current.applied.make).toBe("Toyota");
  });

  it("setParam updates local and applies immediately when deferApply=false", () => {
    const { result } = renderHook(() =>
      useFilters({ initial: {}, deferApply: false })
    );
    act(() => result.current.setParam("make", "Ford"));
    expect(result.current.local.make).toBe("Ford");
    expect(result.current.applied.make).toBe("Ford");
  });

  it("clear empties local and applied", () => {
    const { result } = renderHook(() => useFilters({ initial: { make: "X" } }));
    act(() => result.current.clear());
    expect(Object.keys(result.current.local).length).toBe(0);
    expect(Object.keys(result.current.applied).length).toBe(0);
  });
});
