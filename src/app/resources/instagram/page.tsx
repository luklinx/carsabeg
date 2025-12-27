import Link from "next/link";

export const metadata = {
  title: "Instagram - Cars Abeg",
  description: "Follow Cars Abeg on Instagram.",
};

export default function Instagram() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-4">Instagram</h1>
      <p className="mb-4">
        Follow our Instagram for behind-the-scenes and featured cars.
      </p>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noreferrer"
        className="text-green-600 font-bold"
      >
        Open Instagram
      </a>
      <div className="mt-8">
        <Link href="/" className="text-green-600 font-bold">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
