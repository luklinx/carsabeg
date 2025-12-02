// src/app/test-car/[id]/page.tsx
import { supabaseBrowser } from "@/lib/supabaseClient";

export default async function TestCar({ params }: { params: { id: string } }) {
  const { id } = params;

  // HARD CODE A REAL CAR ID FROM YOUR SUPABASE (COPY ONE FROM TABLE)
  const TEST_ID = "becb83fa-4db7-422b-801e-38e8daafee75";

  const realId = id === "test" ? TEST_ID : id;

  const { data, error, count } = await supabaseBrowser
    .from("cars")
    .select("*", { count: "exact" })
    .eq("id", realId)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-black text-white p-10 font-mono">
      <h1 className="text-4xl font-bold mb-10">NUCLEAR CAR TEST</h1>

      <div className="space-y-4 text-lg">
        <p>
          Requested ID: <span className="text-yellow-400">{id}</span>
        </p>
        <p>
          Using ID: <span className="text-green-400">{realId}</span>
        </p>
        <p>
          Supabase Error:{" "}
          <span className="text-red-400">{error ? error.message : "NONE"}</span>
        </p>
        <p>
          Row Count: <span className="text-cyan-400">{count ?? "null"}</span>
        </p>
        <p>
          Data Found:{" "}
          <span className="text-pink-400">{data ? "YES" : "NO"}</span>
        </p>
      </div>

      {data ? (
        <div className="mt-10 p-10 bg-green-900 rounded-lg">
          <h2 className="text-6xl font-black text-green-400">
            CAR FOUND — IT WORKS!
          </h2>
          <pre className="mt-10 text-sm bg-black p-5 rounded overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="mt-10 p-10 bg-red-900 rounded-lg">
          <h2 className="text-6xl font-black text-red-400">CAR NOT FOUND</h2>
          <p className="text-2xl mt-5">Your setup is broken. Check:</p>
          <ul className="mt-5 text-xl">
            <li>• Is your Supabase URL and anon key correct?</li>
            <li>• Is RLS enabled and blocking reads?</li>
            <li>• Is the table name exactly &quot;cars&quot;?</li>
            <li>• Is the row really there with that exact ID?</li>
          </ul>
        </div>
      )}
    </div>
  );
}
