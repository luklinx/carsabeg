import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () =>
    new URLSearchParams("email=test%40example.com&duplicate=1"),
}));

// Prevent supabase client create from reading env vars during tests
vi.mock("@/lib/supabaseClient", () => ({
  supabaseBrowser: {
    auth: {
      signInWithPassword: vi
        .fn()
        .mockResolvedValue({ data: { session: null }, error: null }),
    },
  },
}));

import SigninForm from "@/components/Auth/SigninForm";

describe("SigninForm", () => {
  it("prefills email and shows duplicate account info when redirected", () => {
    render(<SigninForm />);

    const emailInput = screen.getByPlaceholderText(
      /your@email.com/i
    ) as HTMLInputElement;
    expect(emailInput.value).toBe("test@example.com");

    const info = screen.getByText(/An account with this email already exists/i);
    expect(info).toBeDefined();

    const resetLink = screen.getByText(/Reset password/i);
    expect(resetLink).toBeDefined();
  });
});
