// Small helper utilities used by PendingList for selection and pagination
export function extractIds(cars: { id?: string }[]) {
  return cars
    .map((c) => c.id)
    .filter((id): id is string => !!id && id !== "undefined");
}

export function areAllSelected(
  ids: string[],
  selected: Record<string, boolean>
) {
  return ids.length > 0 && ids.every((id) => !!selected[id]);
}

export function toggleSelectAll(
  ids: string[],
  selected: Record<string, boolean>
) {
  const allSelected = areAllSelected(ids, selected);
  if (allSelected) return {} as Record<string, boolean>;
  const ns: Record<string, boolean> = {};
  ids.forEach((id) => (ns[id] = true));
  return ns;
}
