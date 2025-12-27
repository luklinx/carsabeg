import Link from "next/link";

export const metadata = {
  title: "Cookies Policy - Cars Abeg",
  description: "How and why Cars Abeg uses cookies and similar technologies.",
};

export default function CookiesPolicy() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-2">Cookies Policy</h1>
      <p className="text-sm text-gray-600 mb-6">
        Last updated: December 27, 2025
      </p>

      <p className="mb-4">
        This Cookie Policy explains how Cars Abeg uses cookies, pixels and
        similar tracking technologies when you visit our website or use our
        mobile app (the &apos;Service&apos;), why we use them, and how you can
        control their use.
      </p>

      <section className="space-y-6">
        <h2 className="text-lg font-bold">What are cookies?</h2>
        <p>
          Cookies are small text files placed on your device by your browser to
          store information about your visit. They can be session cookies
          (deleted when you close your browser) or persistent cookies (stored on
          your device for a set period).
        </p>

        <h2 className="text-lg font-bold">How we use cookies</h2>
        <p>
          We use cookies and similar technologies for several purposes including
          to: remember your preferences, keep you signed in, provide secure
          access, measure and improve the Service, detect and prevent fraud, and
          deliver relevant advertising.
        </p>

        <h3 className="font-semibold">Types of cookies we use</h3>
        <ul className="list-disc list-inside">
          <li>
            <strong>Essential cookies:</strong> required for the Service to
            function (e.g., session management).
          </li>
          <li>
            <strong>Performance & analytics:</strong> help us understand how the
            Service is used and how to improve it (e.g., Google Analytics).
          </li>
          <li>
            <strong>Functional cookies:</strong> remember your preferences and
            choices.
          </li>
          <li>
            <strong>Advertising cookies:</strong> used to personalise and
            measure ads and limit how often you see them.
          </li>
        </ul>

        <h2 className="text-lg font-bold">Third-party cookies</h2>
        <p>
          We may allow trusted third parties to set cookies on our Service for
          analytics, advertising and other purposes. These providers have their
          own policies and controls; we encourage you to review their privacy
          notices for details.
        </p>

        <h2 className="text-lg font-bold">How to manage cookies</h2>
        <p>
          You can control or delete cookies via your browser or device settings.
          Blocking all cookies may affect the functionality of the Service. For
          detailed instructions, see{" "}
          <a
            href="https://www.aboutcookies.org/how-to-control-cookies/"
            className="text-green-600"
          >
            aboutcookies.org
          </a>
          .
        </p>

        <h3 className="font-semibold">
          Opting out of analytics and advertising
        </h3>
        <p>
          To opt out of Google Analytics, use the Google Analytics opt-out
          browser add-on:{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout?hl=en"
            className="text-green-600"
          >
            gaoptout
          </a>
          . To control advertising on iOS or Android, follow the device settings
          for advertising identifiers.
        </p>

        <h2 className="text-lg font-bold">Changes to this policy</h2>
        <p>
          We may update our Cookies Policy from time to time. Material changes
          will be communicated via the Service. Continued use of the Service
          after changes indicates your acceptance of the updated Policy.
        </p>

        <h2 className="text-lg font-bold">Contact</h2>
        <p>
          If you have questions about this Cookies Policy, contact us at
          <a href="mailto:privacy@carsabeg.ng" className="text-green-600 ml-1">
            privacy@carsabeg.ng
          </a>
          or{" "}
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
