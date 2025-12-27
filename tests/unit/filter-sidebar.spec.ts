import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams("state=Lagos&city=Ikeja"),
}));

import FilterSidebar from "@/components/FilterSidebar";

describe("FilterSidebar", () => {
  it("clearing state removes city param when pushing URL", () => {
    render(React.createElement(FilterSidebar));

    // Click the "Show All Cars" button which navigates to inventory
    const showBtn = screen.getByText(/Show All Cars/i);
    fireEvent.click(showBtn);

    // Expect router.push called and URL not to contain city
    expect(push).toHaveBeenCalled();
    const calledArg = push.mock.calls[0][0] as string;
    expect(calledArg).toMatch(/inventory/);
    expect(calledArg).not.toMatch(/city=/);
  });

  it("fetches metadata and populates selector options", async () => {
    const fake = {
      success: true,
      data: {
        seller_types: ["Private", "Dealer"],
        body_types: ["Sedan", "SUV"],
        exterior_colors: ["White", "Black"],
        interior_colors: ["Beige", "Grey"],
      },
    };
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({ json: async () => fake });

    render(React.createElement(FilterSidebar));

    // wait for metadata to be applied
    const seller = await screen.findByLabelText(/Seller type/i);
    expect(seller).toBeDefined();
    expect(screen.getByText("Private")).toBeDefined();
    expect(screen.getByText("Sedan")).toBeDefined();
  });
});
