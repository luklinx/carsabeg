import Link from "next/link";

export const metadata = {
  title: "Terms of Use - Cars Abeg",
  description:
    "The rules for using Cars Abeg's website and mobile applications.",
};

export default function Terms() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-2">Terms of Use</h1>
      <p className="text-sm text-gray-600 mb-6">
        Last updated: December 27, 2025
      </p>

      <p className="mb-4">
        These Terms of Use ("Terms") govern your access to and use of the Cars
        Abeg website, mobile applications and related services (the "Service").
        By accessing or using the Service you confirm that you accept these
        Terms and that you are legally permitted to enter into this agreement.
        If you do not agree, please do not use the Service.
      </p>

      <section className="space-y-6">
        <h2 className="text-lg font-bold">1. Our Role</h2>
        <p>
          Cars Abeg operates the platform that enables users to post, view and
          respond to listings for vehicles and related services. We are not a
          seller, buyer, importer, manufacturer or intermediary for transactions
          between users. Any contract for sale or service is made directly
          between the users involved.
        </p>

        <h2 className="text-lg font-bold">2. Disclaimers and No Warranty</h2>
        <p>
          The Service and all content are provided "as is" and "as available",
          to the fullest extent permitted by law. Cars Abeg disclaims all
          representations and warranties, whether express or implied, including
          warranties of fitness for a particular purpose, accuracy, and
          merchantability. You rely on information and listings at your own
          risk.
        </p>

        <h2 className="text-lg font-bold">3. Account Registration</h2>
        <p>
          Some features require an account. When you register you must provide
          accurate information and keep your credentials secure. You are
          responsible for activity that occurs under your account. We may
          suspend or close accounts that violate these Terms or that we suspect
          are fraudulent.
        </p>

        <h2 className="text-lg font-bold">4. User Conduct and Listing Rules</h2>
        <p>
          You agree to use the Service lawfully and not to post listings or
          content that are illegal, misleading, infringing, dangerous, or
          otherwise prohibited. Listings must be accurate and complete. We may
          remove or block access to content that violates these requirements.
        </p>

        <h2 className="text-lg font-bold">5. Fees and Paid Services</h2>
        <p>
          While basic use of the platform may be free, paid features or
          promotional options may be offered and are subject to separate fees.
          Fees are non-refundable except where required by law. Payment terms
          for paid services are provided when you sign up for those services.
        </p>

        <h2 className="text-lg font-bold">6. Intellectual Property</h2>
        <p>
          You retain ownership of content you post, but you grant Cars Abeg a
          licence to host, display and use that content to operate and promote
          the Service. Platform content provided by Cars Abeg is protected by
          copyright, trademark and other laws, and may not be reused without our
          consent.
        </p>

        <h2 className="text-lg font-bold">7. Liability Limit</h2>
        <p>
          To the maximum extent permitted by law, Cars Abeg and its affiliates
          will not be liable for indirect, incidental, special or consequential
          losses arising from your use of the Service. Our total liability to
          you for direct losses is limited to the lesser of the amounts you paid
          to us in the six months before the claim or NGN37,000.
        </p>

        <h2 className="text-lg font-bold">8. Indemnity</h2>
        <p>
          You agree to indemnify and hold Cars Abeg and its partners harmless
          from any claims, losses or expenses arising from your breach of these
          Terms, your listing or your interactions with other users.
        </p>

        <h2 className="text-lg font-bold">
          9. Intellectual Property Complaints
        </h2>
        <p>
          If you believe content on the Service infringes your rights, notify us
          with sufficient details and supporting information so we can
          investigate. Send notices to{" "}
          <a href="mailto:support@carsabeg.ng" className="text-green-600">
            support@carsabeg.ng
          </a>
          .
        </p>

        <h2 className="text-lg font-bold">10. Governing Law and Disputes</h2>
        <p>
          These Terms are governed by the laws of the Republic of Nigeria. Any
          dispute will be resolved by arbitration or court proceedings as set
          out in this section and as permitted by applicable law.
        </p>

        <h2 className="text-lg font-bold">11. Miscellaneous</h2>
        <p>
          If any part of these Terms is found unenforceable, the remainder will
          continue in effect. We may assign or transfer our rights under these
          Terms. We may change these Terms from time to time; material changes
          will be communicated through the Service.
        </p>

        <h2 className="text-lg font-bold">12. Contact</h2>
        <p>
          For questions about these Terms or the Service, contact us at
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
