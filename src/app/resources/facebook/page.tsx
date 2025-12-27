import Link from "next/link";

export const metadata = {
  title: "Facebook - Cars Abeg",
  description: "Follow Cars Abeg on Facebook.",
};

export default function Facebook() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-4">Facebook</h1>
      <p className="mb-4">Follow us on Facebook for updates and promotions.</p>
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noreferrer"
        className="text-green-600 font-bold"
      >
        Open Facebook
      </a>
      <div className="mt-8">
        <Link href="/" className="text-green-600 font-bold">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
