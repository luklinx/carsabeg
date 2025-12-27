import { FAQS } from "@/data/faqs";
import FaqsClient from "@/components/FaqsClient";
import Link from "next/link";

export const metadata = {
  title: "FAQs - Cars Abeg",
  description:
    "Frequently Asked Questions about buying, selling and using Cars Abeg.",
};

export default function FaqsPage() {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-2">Frequently Asked Questions</h1>
      <p className="text-sm text-gray-600 mb-6">
        Search and browse common questions about buying, selling, promotions and
        services on Cars Abeg.
      </p>

      <section className="mb-6">
        <FaqsClient faqs={FAQS} />
      </section>

      <div className="mt-8 text-sm text-amber-800">
        <p>
          Still need help?{" "}
          <Link href="/support" className="text-green-600 font-bold">
            Contact Support
          </Link>
        </p>
      </div>
    </main>
  );
}
