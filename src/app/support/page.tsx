import Link from "next/link";

export const metadata = {
  title: "Support - Cars Abeg",
  description: "Contact support, see safety tips and FAQs.",
};

export default function Support() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-4">Support</h1>
      <p className="mb-4">
        Contact our support team at{" "}
        <a href="mailto:support@carsabeg.ng" className="text-green-600">
          support@carsabeg.ng
        </a>
        .
      </p>
      <h2 className="text-xl font-bold mt-6">Safety tips</h2>
      <p className="mb-4">
        Always meet in public spaces and verify documents before payment.
      </p>
      <h2 className="text-xl font-bold mt-6">FAQs</h2>
      <p className="mb-4">
        Check our Frequently Asked Questions for common queries.
      </p>
      <div className="mt-8">
        <Link href="/" className="text-green-600 font-bold">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
