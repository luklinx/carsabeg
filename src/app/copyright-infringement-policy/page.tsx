import Link from "next/link";

export const metadata = {
  title: "Copyright & IP Infringement Policy - Cars Abeg",
  description:
    "How to notify us of copyright or trademark infringement and how we respond.",
};

export default function CopyrightPolicy() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-2">
        Copyright & IP Infringement Policy
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Last updated: December 27, 2025
      </p>

      <p className="mb-4">
        Cars Abeg respects intellectual property rights and expects users to do
        the same. If you believe content posted on our platform infringes your
        copyright or trademark, this page explains how to notify us and what to
        expect after we receive your claim.
      </p>

      <section className="space-y-6">
        <h2 className="text-lg font-bold">Reporting copyright infringement</h2>
        <p>
          To report alleged copyright infringement, send an email to{" "}
          <a href="mailto:support@carsabeg.ng" className="text-green-600">
            support@carsabeg.ng
          </a>{" "}
          with the information described below. Provide as much detail as
          possible to help us locate and evaluate the material.
        </p>
        <h3 className="font-semibold">Required information</h3>
        <ul className="list-disc list-inside">
          <li>Your full name, address, phone number and email address</li>
          <li>
            A clear description of the copyrighted work you claim has been
            infringed
          </li>
          <li>
            The URL(s) or other location details of the material you believe
            infringes your copyright
          </li>
          <li>
            A statement that you have a good-faith belief that use of the
            material is not authorised by the copyright owner
          </li>
          <li>
            A statement, under penalty of perjury, that the information in your
            notice is accurate and that you are the copyright owner or
            authorised to act on behalf of the owner
          </li>
          <li>Your physical or electronic signature</li>
        </ul>

        <h2 className="text-lg font-bold">Reporting trademark infringement</h2>
        <p>
          For trademark claims, please email{" "}
          <a href="mailto:support@carsabeg.ng" className="text-green-600">
            support@carsabeg.ng
          </a>{" "}
          and include documentation that shows your ownership of the mark and
          details sufficient to locate the allegedly infringing content on our
          site.
        </p>
        <h3 className="font-semibold">Suggested documentation</h3>
        <ul className="list-disc list-inside">
          <li>
            A copy or registration certificate for the trademark (if available)
          </li>
          <li>A description of the goods or services covered by the mark</li>
          <li>URLs or locations of the allegedly infringing material</li>
          <li>
            Contact details and a statement made under penalty of perjury as
            described above
          </li>
        </ul>

        <h2 className="text-lg font-bold">How we respond</h2>
        <p>
          After receiving a valid notice, we will assess the claim and may take
          actions including removing or disabling access to the content,
          notifying the user who posted the material, or terminating accounts
          for repeat infringers. We handle claims in accordance with applicable
          law and our internal policies.
        </p>

        <h2 className="text-lg font-bold">Counter-notice and review</h2>
        <p>
          If you are notified that material you posted was removed for alleged
          infringement and you believe this was done in error, you may submit a
          counter-notice with your contact information, identification of the
          material that was removed, a statement that you have a good-faith
          belief the material was removed in error, and consent to local
          jurisdiction if requested. We will review valid counter-notices and
          may restore content if appropriate.
        </p>

        <h2 className="text-lg font-bold">False claims and liability</h2>
        <p>
          Making false claims of infringement may have legal consequences. We
          recommend seeking legal advice before submitting a claim. We are not
          responsible for legal disputes between users and third parties and do
          not provide legal representation to claimants or alleged infringers.
        </p>

        <h2 className="text-lg font-bold">Contact</h2>
        <p>
          To report an alleged infringement or for further information, email{" "}
          <a href="mailto:support@carsabeg.ng" className="text-green-600">
            support@carsabeg.ng
          </a>
          . For intellectual property matters involving legal counsel, please
          include contact details for your authorised representative.
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
