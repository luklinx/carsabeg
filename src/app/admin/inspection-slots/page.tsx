import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import AdminSlotBookings from "@/components/AdminSlotBookings";

interface InspectionSlot {
  id: string;
  start_at: string;
  end_at: string;
  capacity: number;
  car_id: string | null;
  booked?: number;
  available?: boolean;
}

async function getSupabase() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  return supabase;
}

export default async function InspectionSlotsAdminPage() {
  const supabase = await getSupabase();

  // basic admin guard — assume middleware or simple allowlist is in place
  const { data: slots } = await supabase
    .from("inspection_slots")
    .select("*")
    .order("start_at", { ascending: true });

  let annotated: InspectionSlot[] = slots || [];
  if (annotated.length) {
    const ids = annotated.map((s: InspectionSlot) => s.id);
    const { data: counts } = await supabase.rpc("count_bookings_by_slot", {
      slot_ids: ids,
    });
    const countMap: Record<string, number> = {};
    (counts || []).forEach((c: { slot_id: string; count: number }) => (countMap[c.slot_id] = Number(c.count)));
    annotated = (annotated || []).map((s: InspectionSlot) => ({
      ...s,
      booked: countMap[s.id] || 0,
      available: (s.capacity || 1) - (countMap[s.id] || 0) > 0,
    }));
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Inspection Slots</h2>
      <p className="text-sm text-[var(--muted)] mt-2">
        Create and manage inspection slots for dealers.
      </p>

      {/* Server-rendered list */}
      <div className="mt-4 space-y-2">
        {(annotated || []).map((s: InspectionSlot) => (
          <div
            key={s.id}
            className="p-3 border rounded-lg flex items-center justify-between"
          >
            <div>
              <div className="font-medium text-[var(--foreground)]">
                {new Date(s.start_at).toLocaleString()} -{" "}
                {new Date(s.end_at).toLocaleTimeString()}
              </div>
              <div className="text-xs text-gray-600">
                {s.car_id ? `Car: ${s.car_id}` : "Global"} • Capacity:{" "}
                {s.capacity}
                <span className="ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-[var(--table-head-bg)] text-[var(--table-head-color)]">
                  {s.booked}/{s.capacity} booked
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <AdminSlotBookings slotId={s.id} />

              {(s.booked ?? 0) > 0 && (
                <form
                  action="/api/admin/inspection-slots"
                  method="post"
                  className="confirm-cancel"
                >
                  <input type="hidden" name="_method" value="cancel_bookings" />
                  <input type="hidden" name="id" value={s.id} />
                  <button type="submit" className="text-sm text-yellow-600">
                    Cancel bookings
                  </button>
                </form>
              )}

              <form action="/api/admin/inspection-slots" method="post">
                <input type="hidden" name="_method" value="delete" />
                <input type="hidden" name="id" value={s.id} />
                <button type="submit" className="text-sm text-red-600">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="font-bold">Create slot</h3>
        <form
          action="/api/admin/inspection-slots"
          method="post"
          className="mt-2 space-y-2 max-w-md"
        >
          <div>
            <label className="text-xs font-bold">Start</label>
            <input
              name="start_at"
              type="datetime-local"
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold">End</label>
            <input
              name="end_at"
              type="datetime-local"
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold">Capacity</label>
            <input
              name="capacity"
              type="number"
              defaultValue={1}
              min={1}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="text-xs font-bold">Car ID (optional)</label>
            <input
              name="car_id"
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="car uuid or leave blank"
            />
          </div>
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Create slot
            </button>
          </div>
        </form>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `document.addEventListener('submit', function(e){ try{ const t = e.target; if (t && t.classList && t.classList.contains('confirm-cancel')){ if (!confirm('Cancel all bookings for this slot? This cannot be undone.')) { e.preventDefault(); } } }catch(err){} });`,
        }}
      />
    </div>
  );
}
