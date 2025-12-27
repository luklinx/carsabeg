import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - Cars Abeg",
  description: "How Cars Abeg collects, uses and protects your personal data.",
};

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-600 mb-6">
        Effective date: December 27, 2025
      </p>

      <p className="mb-4">
        This Privacy Policy describes the types of personal information we
        collect when you use Cars Abeg (website and mobile applications), why we
        collect it, how we use it, who we share it with, and the choices you can
        make about your information.
      </p>

      <section className="space-y-6">
        <h2 className="text-xl font-bold">1. Information we collect</h2>
        <p>
          We collect information you provide directly (for example, when you
          register, post an ad, contact support or apply for financing),
          information from third party accounts when you connect them (Google,
          Apple, Meta, Truecaller), and technical or usage information that is
          generated automatically when you use our Service (for example, IP
          address, device identifiers, cookies and analytics data).
        </p>

        <h3 className="font-semibold">Examples</h3>
        <ul className="list-disc list-inside">
          <li>
            Contact details: name, email address, phone number and address
          </li>
          <li>
            Account details: profile photo, listing information and settings
          </li>
          <li>
            Verification data: identity documents or business registration
          </li>
          <li>
            Transaction data: payment and order information (processed by our
            payment partners)
          </li>
          <li>
            Device & usage data: IP address, device model, advertising IDs,
            browser and interaction logs
          </li>
        </ul>

        <h2 className="text-xl font-bold">2. How we use your information</h2>
        <p>
          We use personal data to operate and improve the Service, to secure and
          verify accounts, to provide customer support, to personalise content
          and recommendations, to process payments, and to send you important
          service messages or marketing where you have consented.
        </p>

        <h2 className="text-xl font-bold">
          3. Identity verification and automated checks
        </h2>
        <p>
          For certain activities (such as posting in restricted categories,
          participating in auctions, or account recovery) we may ask for
          identity documents. We may use automated tools, including AI-backed
          services, to check document authenticity. If an automated check flags
          an issue you may request a manual review by contacting support.
        </p>

        <h2 className="text-xl font-bold">4. Legal basis and sharing</h2>
        <p>
          We process personal data based on legitimate interests (e.g.,
          security, fraud prevention, and product improvement), performance of a
          contract, consent (where required), or to comply with legal
          obligations. We share information with trusted service providers
          (hosting, analytics, payments, identity verification), with regulators
          or law enforcement when required by law, and with partners when you
          opt into additional services (for example, financing partners).
        </p>

        <h2 className="text-xl font-bold">5. Cookies and advertising</h2>
        <p>
          We use cookies and similar technologies to operate the Service, to
          remember preferences, and to provide personalised advertising. You can
          control cookie settings through your browser or device and opt out of
          some targeted advertising using industry opt‑out tools.
        </p>

        <h2 className="text-xl font-bold">6. Your rights and controls</h2>
        <p>
          Depending on your country, you may have rights to access, correct,
          delete or restrict processing of your personal data, and to withdraw
          consent. To exercise these rights, contact us at
          <a href="mailto:support@carsabeg.ng" className="text-green-600 ml-1">
            support@carsabeg.ng
          </a>
          .
        </p>

        <h2 className="text-xl font-bold">7. Data retention and transfers</h2>
        <p>
          We keep data as long as necessary to provide the Service, comply with
          legal obligations, resolve disputes and enforce agreements. Your data
          may be transferred and processed in countries outside your own; where
          required, we apply appropriate safeguards.
        </p>

        <h2 className="text-xl font-bold">8. Children</h2>
        <p>
          Our Service is not intended for children under 16. If you believe a
          child under 16 has provided us information, contact us and we will
          take steps to remove it where appropriate.
        </p>

        <h2 className="text-xl font-bold">9. Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Significant
          changes will be communicated through the Service or other reasonable
          means. Continued use of the Service after changes indicates your
          acceptance of the updated policy.
        </p>

        <h2 className="text-xl font-bold">10. Contact us</h2>
        <p>
          For questions or requests related to privacy, email us at
          <a href="mailto:privacy@carsabeg.ng" className="text-green-600 ml-1">
            privacy@carsabeg.ng
          </a>
          or contact support at{" "}
          <a href="mailto:support@carsabeg.ng" className="text-green-600 ml-1">
            support@carsabeg.ng
          </a>
          .
        </p>
      </section>

      <div className="mt-8">
        <Link href="/" className="text-green-600 font-bold">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
