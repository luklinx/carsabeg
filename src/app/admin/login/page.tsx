// app/admin/login/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) redirect("/admin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-900 flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 max-w-md w-full">
        <h1 className="text-4xl font-black text-white text-center mb-8">
          CARS ABEG ADMIN
        </h1>
        <form action="/api/auth" method="post" className="space-y-6">
          <button
            type="submit"
            name="provider"
            value="google"
            className="w-full bg-white text-black py-5 rounded-2xl font-black text-xl hover:scale-105 transition shadow-lg"
          >
            LOGIN WITH GOOGLE
          </button>
        </form>
        <p className="text-center text-gray-400 mt-8 text-sm">
          Only authorized admins can access
        </p>
      </div>
    </div>
  );
}
