import Link from "next/link";

export const metadata = {
  title: "Candidate Privacy Policy - Cars Abeg",
  description:
    "How we collect, use and protect personal data provided during recruitment.",
};

export default function CandidatePrivacy() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-2">Candidate Privacy Policy</h1>
      <p className="text-sm text-gray-600 mb-6">
        Effective date: December 27, 2025
      </p>

      <p className="mb-4">
        Cars Abeg values the privacy of job applicants. This policy explains
        what information we collect during recruitment, how we use it, how long
        we retain it, and how you can exercise your privacy rights.
      </p>

      <section className="space-y-6">
        <h2 className="text-lg font-bold">1. Who is the controller</h2>
        <p>
          Cars Abeg Limited is the data controller for recruitment information
          collected through our careers site, application forms, email and
          third-party recruitment services.
        </p>

        <h2 className="text-lg font-bold">2. Information we collect</h2>
        <p>
          We collect information you provide during the application process and
          details generated in the course of recruitment. This may include:
        </p>
        <ul className="list-disc list-inside">
          <li>Contact details (name, email, phone, address)</li>
          <li>Curriculum vitae, cover letters and portfolio items</li>
          <li>Employment history, education and professional qualifications</li>
          <li>References and referee contact details</li>
          <li>Interview notes and assessment records</li>
          <li>
            Right-to-work documents and other identity verification documents
          </li>
          <li>Any information you provide in communications with us</li>
        </ul>

        <h2 className="text-lg font-bold">3. How we use your data</h2>
        <p>
          We use candidate data to assess your suitability for roles, to
          communicate about vacancies, to perform background or reference checks
          where applicable, and to manage the recruitment process.
        </p>

        <h2 className="text-lg font-bold">4. Legal basis</h2>
        <p>
          Where required by applicable law, we rely on your consent, the
          performance of pre-contractual steps, or our legitimate interests to
          process your information (for example, to conduct checks, prevent
          fraud, and maintain hiring records).
        </p>

        <h2 className="text-lg font-bold">5. Sharing and transfers</h2>
        <p>We may share your information with:</p>
        <ul className="list-disc list-inside">
          <li>Third-party recruitment platforms and job boards</li>
          <li>Background and reference check providers</li>
          <li>Our internal HR and hiring teams</li>
          <li>Legal or regulatory bodies where required by law</li>
        </ul>
        <p>
          Your data may be processed outside Nigeria; where necessary we will
          use contractual safeguards or equivalent protections required by law.
        </p>

        <h2 className="text-lg font-bold">6. Retention</h2>
        <p>
          We retain application data while recruitment for the role is active
          and for a reasonable period afterwards (typically up to 12 months),
          unless you consent to longer retention for future opportunities. We
          will delete or anonymise data when it is no longer needed, unless we
          are legally required to keep it longer.
        </p>

        <h2 className="text-lg font-bold">7. Your rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal
          data, object to processing or ask for restrictions where applicable.
          To exercise these rights contact us at
          <a href="mailto:privacy@carsabeg.ng" className="text-green-600 ml-1">
            privacy@carsabeg.ng
          </a>
          .
        </p>

        <h2 className="text-lg font-bold">8. Security</h2>
        <p>
          We use technical and organisational measures to protect candidate data
          from unauthorised access, loss or misuse. While we take reasonable
          steps to secure data, no system is completely secure and we cannot
          guarantee absolute protection.
        </p>

        <h2 className="text-lg font-bold">9. Changes to this policy</h2>
        <p>
          We may update this policy from time to time. Significant changes will
          be informed via the careers site or other reasonable means.
        </p>

        <h2 className="text-lg font-bold">10. Contact</h2>
        <p>
          For questions or to exercise your rights contact{" "}
          <a href="mailto:privacy@carsabeg.ng" className="text-green-600 ml-1">
            privacy@carsabeg.ng
          </a>
          or reach out to our support team at{" "}
          <a href="mailto:support@carsabeg.ng" className="text-green-600 ml-1">
            support@carsabeg.ng
          </a>
          .
        </p>
      </section>

      <div className="mt-8">
        <Link href="/careers" className="text-green-600 font-bold">
          ← Back to Careers
        </Link>
      </div>
    </main>
  );
}
