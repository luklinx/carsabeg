import { describe, it, expect } from "vitest";
import { extractIds, areAllSelected, toggleSelectAll } from "../pending-utils";

describe("pending-utils", () => {
  it("extractIds filters out invalid ids", () => {
    const cars = [
      { id: "1" },
      { id: undefined },
      { id: "undefined" },
      { id: "2" },
    ];
    expect(extractIds(cars)).toEqual(["1", "2"]);
  });

  it("areAllSelected returns true only when all ids are selected", () => {
    const ids = ["a", "b"];
    expect(areAllSelected(ids, { a: true, b: true })).toBe(true);
    expect(areAllSelected(ids, { a: true })).toBe(false);
    expect(areAllSelected([], {})).toBe(false);
  });

  it("toggleSelectAll selects all ids when not all selected, otherwise clears", () => {
    const ids = ["1", "2", "3"];
    const selected = { "1": true };
    expect(toggleSelectAll(ids, selected)).toEqual({
      "1": true,
      "2": true,
      "3": true,
    });
    expect(toggleSelectAll(ids, { "1": true, "2": true, "3": true })).toEqual(
      {}
    );
  });
});
