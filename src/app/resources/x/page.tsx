import Link from "next/link";

export const metadata = {
  title: "X (Twitter) - Cars Abeg",
  description: "Follow Cars Abeg on X (formerly Twitter).",
};

export default function X() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-4">X (Twitter)</h1>
      <p className="mb-4">Follow us on X for the latest news and listings.</p>
      <a
        href="https://x.com"
        target="_blank"
        rel="noreferrer"
        className="text-green-600 font-bold"
      >
        Open X
      </a>
      <div className="mt-8">
        <Link href="/" className="text-green-600 font-bold">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
