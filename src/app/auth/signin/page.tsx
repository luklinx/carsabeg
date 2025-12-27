// src/app/auth/signin/page.tsx
import SigninForm from "@/components/Auth/SigninForm";
import ClientRedirectIfAuthed from "@/components/Auth/ClientRedirectIfAuthed";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Sign In | Cars Abeg",
  description: "Sign in to your Cars Abeg account",
};

export default function SigninPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <ClientRedirectIfAuthed />
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-green-600 font-bold mb-6 hover:text-green-700 transition"
        >
          <ArrowLeft size={20} /> Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
            Welcome Back
          </h1>
          <p className="text-gray-600 font-medium mt-2">
            Sign in to your Cars Abeg account
          </p>
        </div>

        <SigninForm />
      </div>
    </div>
  );
}
