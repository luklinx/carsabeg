import Link from "next/link";

export const metadata = {
  title: "Billing Policy - Cars Abeg",
  description:
    "How payments, credits and premium services are billed and managed.",
};

export default function BillingPolicy() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-2">Billing Policy</h1>
      <p className="text-sm text-gray-600 mb-6">
        Effective date: December 27, 2025
      </p>

      <p className="mb-4">
        This page explains how billing works for premium services and credits on
        Cars Abeg, including payment methods, validity periods, refunds and
        conditions that may affect your purchased services or credits.
      </p>

      <section className="space-y-6">
        <h2 className="text-lg font-bold">Premium services</h2>
        <p>
          We offer optional paid features such as Boost Plans and Top Ads
          promotions to increase the visibility of your listings. Details
          (including available packages, durations and prices) are shown in the
          premium services area on the site or in the app when you choose a
          promotion.
        </p>

        <h2 className="text-lg font-bold">Ordering and payments</h2>
        <p>
          You can purchase premium services from the Premium Services page or
          while creating a listing. We accept payment through our supported
          processors and payment channels. If you choose card, bank transfer or
          eWallet, you will be redirected to the payment provider’s checkout.
          Payment pages are secured by the payment provider and we do not store
          full card numbers.
        </p>

        <h2 className="text-lg font-bold">Changes to services and fees</h2>
        <p>
          Cars Abeg may change available features, fees and payment methods at
          any time. When we make material pricing changes we will provide notice
          through the Service. Continued use of paid features after any change
          constitutes acceptance of the updated terms.
        </p>

        <h2 className="text-lg font-bold">Refunds and cancellations</h2>
        <p>
          Except where required by law, fees for premium services are non-
          refundable. No proration or refunds will be provided if a listing is
          removed for violating the Terms of Use or if you choose to deactivate
          a paid feature early.
        </p>

        <h2 className="text-lg font-bold">Validity and expirations</h2>
        <p>
          Certain packages (for example, Top Ads Promo) have a defined validity
          period from the date of purchase. If you do not use a purchased
          package within its validity period you will not be entitled to a
          refund, replacement or compensation.
        </p>

        <h2 className="text-lg font-bold">Credits</h2>
        <p>
          You may buy Credits on the platform that can be applied to pay for
          premium services. Credits are unit-denominated; 1 Credit equals 1
          Nigerian Naira for payment purposes. Credits have a validity period
          (typically 12 months) and will expire if unused after that time.
        </p>

        <h3 className="font-semibold">Important notes about Credits</h3>
        <ul className="list-disc list-inside">
          <li>
            Credits are not legal tender and do not represent cash or property.
          </li>
          <li>
            Credits are non-transferable, non-sellable and may not be exchanged
            for cash.
          </li>
          <li>
            Credits may be forfeited if your account is suspended, terminated
            for breach, inactive for an extended period, or if we suspect fraud
            or misuse.
          </li>
        </ul>

        <h2 className="text-lg font-bold">No guarantee of results</h2>
        <p>
          While paid features are intended to increase visibility, Cars Abeg
          does not guarantee specific outcomes or sales as a result of using
          premium services.
        </p>

        <h2 className="text-lg font-bold">Contact and disputes</h2>
        <p>
          For billing questions or refund requests, contact our billing team at
          <a href="mailto:billing@carsabeg.ng" className="text-green-600 ml-1">
            billing@carsabeg.ng
          </a>
          or support at{" "}
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
