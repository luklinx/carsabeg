// src/app/auth/signup/page.tsx
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabaseServer";
import SignupForm from "@/components/Auth/SignupForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Create Account | Cars Abeg",
  description: "Sign up for Cars Abeg to buy and sell cars easily",
};

export default async function SignupPage() {
  // Check if user is already logged in
  const supabase = getSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from_green-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-green-600 font-bold mb-6 hover:text-green-700 transition"
        >
          <ArrowLeft size={20} /> Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
            Create Account
          </h1>
          <p className="text-gray-600 font-medium mt-2">
            Join Nigeria&apos;s fastest-growing car marketplace
          </p>
        </div>

        <SignupForm />
      </div>
    </div>
  );
}
