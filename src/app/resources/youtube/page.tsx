import Link from "next/link";

export const metadata = {
  title: "YouTube - Cars Abeg",
  description: "Subscribe to Cars Abeg on YouTube.",
};

export default function YouTube() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-4">YouTube</h1>
      <p className="mb-4">
        Subscribe to our channel for video walkthroughs and reviews.
      </p>
      <a
        href="https://youtube.com"
        target="_blank"
        rel="noreferrer"
        className="text-green-600 font-bold"
      >
        Open YouTube
      </a>
      <div className="mt-8">
        <Link href="/" className="text-green-600 font-bold">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
