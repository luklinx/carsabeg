import Link from "next/link";

export const metadata = {
  title: "Careers - Cars Abeg",
  description: "Work with Cars Abeg — open roles and how to apply.",
};

export default function Careers() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-4">We're Hiring</h1>
      <p className="mb-4">Join the team. Check open roles and apply.</p>
      <section className="space-y-4">
        <h2 className="font-bold">Open Roles</h2>
        <p>
          We frequently hire engineers, product managers and marketing talent.
          Send a CV to{" "}
          <a href="mailto:hr@carsabeg.ng" className="text-green-600">
            hr@carsabeg.ng
          </a>
          .
        </p>
      </section>

      <div className="mt-8">
        <Link
          href="/candidate-privacy-policy"
          className="text-green-600 font-bold"
        >
          Candidate Privacy &raquo;
        </Link>
      </div>
    </main>
  );
}
