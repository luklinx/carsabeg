// src/app/debug-car/page.tsx   ← NEW FILE
import { supabaseServer } from "@/lib/supabaseServer";

export default async function DebugCar() {
  // HARD-CODED REAL CAR ID FROM YOUR SUPABASE (COPY ONE FROM THE TABLE)
  const HARD_CODED_ID = "becb83fa-4db7-422b-801e-38e8daafee75"; // ← CHANGE THIS

  const { data, error, count } = await supabaseServer
    .from("cars")
    .select("*", { count: "exact" })
    .eq("id", HARD_CODED_ID)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-black text-white p-20 font-bold text-xl space-y-8">
      <h1 className="text-6xl">FINAL NUCLEAR DEBUG</h1>

      <div className="bg-gray-900 p-10 rounded">
        <p>
          Looking for ID:{" "}
          <span className="text-yellow-400">{HARD_CODED_ID}</span>
        </p>
        <p>
          Env URL:{" "}
          <span className="text-cyan-400">
            {process.env.NEXT_PUBLIC_SUPABASE_URL || "MISSING"}
          </span>
        </p>
        <p>
          Table exists?{" "}
          <span className="text-green-400">{data ? "YES" : "NO"}</span>
        </p>
        <p>
          Error:{" "}
          <span className="text-red-400">{error?.message || "NONE"}</span>
        </p>
        <p>
          Count: <span className="text-pink-400">{count ?? "null"}</span>
        </p>
      </div>

      {data ? (
        <div className="bg-green-900 p-20 rounded-3xl text-center">
          <h2 className="text-8xl">CAR FOUND — SYSTEM WORKS!</h2>
          <pre className="mt-10 bg-black p-10 rounded text-left text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="bg-red-900 p-20 rounded-3xl text-center">
          <h2 className="text-8xl">STILL DEAD</h2>
          <p className="text-4xl mt-10">
            Then your Supabase project is wrong or RLS blocks anon
          </p>
        </div>
      )}
    </div>
  );
}
