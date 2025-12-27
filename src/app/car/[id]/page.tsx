// src/app/car/[id]/page.tsx
// SERVER COMPONENT — PERFECT NEXT.JS 16 WAY

import Link from "next/link";
import { getServerAuth } from "@/lib/serverAuth";
import {
  MessageCircle,
  Shield,
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import dynamic from "next/dynamic";

function SpecsSkeletonFallback() {
  return (
    <div className="mt-4">
      <div className="bg-white p-4 rounded-2xl shadow animate-pulse h-28" />
    </div>
  );
}

const CarSpecsClient = dynamic(() => import("@/components/CarSpecs"), {
  ssr: true,
  loading: () => <SpecsSkeletonFallback />,
});
import CarDetailActions from "@/components/CarDetailActions";

import { Suspense } from "react";

function GallerySkeletonFallback() {
  return (
    <div className="w-full rounded-2xl bg-gray-100 animate-pulse h-64 md:h-96" />
  );
}
function SimilarCarsSkeletonFallback() {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-40 rounded-xl bg-gray-100 animate-pulse" />
      ))}
    </div>
  );
}

import ImageGallery from "@/components/CarGallery";
import SimilarCars from "@/components/SimilarCars";
import ViewsPinger from "@/components/ViewsPinger";
import CarDetailClient from "@/components/CarDetailClient";
import PromoBanner from "@/components/PromoBanner";
import ReportUnavailSection from "@/components/ReportUnavailSection";
import FullGalleryModal from "@/components/FullGalleryModal";
import PriceCard from "@/components/PriceCard";
import BookInspectionCTA from "@/components/BookInspectionCTA";

export function generateMetadata() {
  // Avoid reading dynamic `params` synchronously here because params may be a Promise
  // in Next.js dev/runtime. Return safe, generic metadata to avoid runtime warnings.
  return {
    title: `Listing | CarsAbeg`,
    description: `View this listing on CarsAbeg: photos, specs, price and contact the seller.`,
  };
}

export default async function CarDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id || id === "undefined" || id.trim() === "" || id.length < 10) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-black text-green-600 mb-4">
            Listing Not Found
          </h1>
          <p className="text-lg text-gray-700 mb-6">Invalid listing ID.</p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/inventory"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-bold"
            >
              Browse All Cars
            </Link>
            <Link
              href="/"
              className="inline-block bg-white border border-gray-200 px-6 py-3 rounded-xl font-bold"
            >
              Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { user, supabase } = await getServerAuth();

  const { data: car, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .eq("approved", true)
    .single();

  if (error || !car) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-black text-green-600 mb-8">404</h1>
          <p className="text-2xl font-bold text-gray-800 mb-4">
            This car is no longer available
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/inventory"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold"
            >
              Browse All Cars
            </Link>
            <Link
              href="/sell"
              className="inline-block bg-white border border-gray-200 px-6 py-3 rounded-lg font-bold"
            >
              Create Listing
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Best-effort server-side increment of views
  let serverIncremented = false;
  try {
    const current = (car.views_count as number) || 0;
    try {
      const mod = await import("@/lib/supabaseAdmin");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabaseAdmin = (mod && (mod.default ?? mod)) as any;
      const { error: updErr } = await supabaseAdmin
        .from("cars")
        .update({ views_count: current + 1 })
        .eq("id", id);
      if (!updErr) serverIncremented = true;
    } catch (err) {
      // ignore — best-effort increment; don't block the page
      console.error("views increment failed (admin client load)", err);
    }
  } catch (e) {
    console.error("views increment failed", e);
  }

  const formattedPrice = Number(car.price ?? 0).toLocaleString("en-NG");
  const images = car.images?.length ? car.images : ["/placeholder.jpg"];

  const viewsMeta = Number(car.views_count || 0);

  const { data: dealerCars } = await supabase
    .from("cars")
    .select("id")
    .eq("dealer_name", car.dealer_name)
    .eq("approved", true);
  const dealerAdsCount = dealerCars?.length || 1;

  // Try to fetch seller profile from the users table (prefers user_id when available)
  let sellerProfile: null | {
    id: string;
    full_name?: string | null;
    profile_photo_url?: string | null;
    created_at?: string | null;
  } = null;
  let sellerListingsCount = dealerAdsCount;

  if (car.user_id) {
    try {
      const { data: seller } = await supabase
        .from("users")
        .select("id, full_name, profile_photo_url, created_at")
        .eq("id", car.user_id)
        .maybeSingle();
      if (seller) sellerProfile = seller;

      const { count } = await supabase
        .from("cars")
        .select("id", { head: true, count: "exact" })
        .eq("user_id", car.user_id)
        .eq("approved", true);
      if (typeof count === "number") sellerListingsCount = count;
    } catch (e) {
      console.error("Failed to fetch seller profile/listings count", e);
    }
  }

  let dealerRating = { average: 0, total: 0 };
  try {
    const { data: feedbacks } = await supabase
      .from("seller_feedback")
      .select("*")
      .eq("dealer_id", car.id);
    if (feedbacks && feedbacks.length > 0) {
      const avgRating =
        feedbacks.reduce(
          (sum: number, f: { rating: number }) => sum + f.rating,
          0
        ) / feedbacks.length;
      dealerRating = {
        average: parseFloat(avgRating.toFixed(1)),
        total: feedbacks.length,
      };
    }
  } catch {}

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 md:pt-8">
        <nav className="mb-4">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600"
          >
            <ArrowLeft size={18} /> Back to Inventory
          </Link>
        </nav>

        {/* Full-width collage (rounded externally) */}
        {/* Breadcrumbs (desktop only) */}
        <nav
          aria-label="Breadcrumb"
          className="hidden md:block text-sm text-gray-600 mb-3"
        >
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li className="text-gray-300">
              <ChevronRight size={14} />
            </li>
            <li>
              <Link href="/inventory" className="hover:underline">
                Inventory
              </Link>
            </li>
            <li className="text-gray-300">
              <ChevronRight size={14} />
            </li>
            <li>
              <Link
                href={`/inventory?make=${encodeURIComponent(car.make)}`}
                className="hover:underline"
              >
                {car.make}
              </Link>
            </li>
            <li className="text-gray-300">
              <ChevronRight size={14} />
            </li>
            <li>
              <Link
                href={`/inventory?make=${encodeURIComponent(
                  car.make
                )}&model=${encodeURIComponent(car.model)}`}
                className="hover:underline"
              >
                {car.model}
              </Link>
            </li>
            <li className="text-gray-300">
              <ChevronRight size={14} />
            </li>
            <li className="text-gray-600">{car.year}</li>
          </ol>
        </nav>

        <div className="mb-6 rounded-[4px] overflow-hidden relative w-full collage-root">
          <Suspense fallback={<GallerySkeletonFallback />}>
            <ImageGallery images={images} />
          </Suspense>
        </div>

        <section className="flex flex-col md:flex-row md:items-start md:gap-8">
          {/* LEFT: MAIN CONTENT (70%) */}
          <div className="w-full md:w-[70%] listing-left">
            {/* Price card (immediately after collage, full width inside left column) */}
            <div className="mb-6 md:mb-8">
              <PriceCard
                car={car}
                formattedPrice={formattedPrice}
                viewsMeta={viewsMeta}
                className="w-full"
              />
            </div>

            {/* Title + meta + price (responsive) */}
            <header className="mb-4 order-2 md:order-1">
              {/* Desktop title (large) */}
              <div id="basic-info">
                {/* Desktop title intentionally removed per request */}
              </div>
            </header>

            {/* Specs */}
            <CarSpecsClient car={car} />

            {/* Description */}
            {car.description && (
              <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-black mb-4">
                  Description
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {car.description}
                </p>
              </div>
            )}

            {/* Promo: Get Financing & Value your car (left column, below description) */}
            <div className="mt-6">
              <PromoBanner />
            </div>

            {/* Book Inspection CTA (left column) */}
            <div className="mt-6">
              <div className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between gap-4 transition hover:shadow-md">
                <div className="min-w-0">
                  <div className="text-base sm:text-lg font-extrabold text-gray-900">
                    Buying this {car.make}?
                  </div>
                  <div className="text-sm text-gray-800 mt-1 font-semibold">
                    Get it inspected!
                  </div>

                  <ul className="mt-2 space-y-1 text-sm text-gray-800">
                    <li className="flex items-start gap-2">
                      <CheckCircle
                        size={16}
                        className="text-red-600 mt-0.5 flex-shrink-0"
                      />
                      <span>Verify the car’s real condition</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle
                        size={16}
                        className="text-red-600 mt-0.5 flex-shrink-0"
                      />
                      <span>Uncover past history</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle
                        size={16}
                        className="text-red-600 mt-0.5 flex-shrink-0"
                      />
                      <span>Make a safer, smarter purchase</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <BookInspectionCTA isLoggedIn={!!user} />
                </div>
              </div>
            </div>

            {/* Safety Tips (left column) */}
            <div className="mt-8">
              <section className="py-8 px-0 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl shadow-md">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle size={28} className="text-red-600" />
                    <h3 className="text-xl font-black">Safety Tips</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm transition hover:shadow-md">
                      <div className="font-black">Meet in Safe Places</div>
                      <div className="text-sm text-gray-600">
                        Always meet the seller in a public location during
                        daylight
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm transition hover:shadow-md">
                      <div className="font-black">Verify Identity</div>
                      <div className="text-sm text-gray-600">
                        Ask for government-issued ID and confirm seller details
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm transition hover:shadow-md">
                      <div className="font-black">Get Vehicle Inspection</div>
                      <div className="text-sm text-gray-600">
                        Have a trusted mechanic inspect the car before payment
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm transition hover:shadow-md">
                      <div className="font-black">Use Secure Payment</div>
                      <div className="text-sm text-gray-600">
                        Never send money via wire; use escrow or bank transfer
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* RIGHT: SIDEBAR (30%) */}
          <aside className="w-full md:w-[30%] mt-6 md:mt-0 listing-right">
            <div className="sticky top-20 space-y-4 listing-right-stack">
              <div className="flex flex-wrap justify-center gap-4 text-green-700 font-black text-sm mt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} /> Real Photos
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={18} /> Verified Seller
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={18} /> Instant Reply
                </div>
              </div>

              <ViewsPinger
                carId={car.id}
                serverIncremented={serverIncremented}
              />

              <CarDetailClient
                car={car}
                formattedPrice={formattedPrice}
                images={images}
                dealerAdsCount={dealerAdsCount}
                dealerRating={dealerRating}
                isLoggedIn={!!user}
                sellerProfile={sellerProfile}
                sellerListingsCount={sellerListingsCount}
              />

              {/* Promo banner (desktop only) placed below seller card in right column */}
              <div className="hidden md:block mt-4">
                <div className="bg-white p-4 rounded-2xl shadow border border-gray-100">
                  <PromoBanner compact />
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Full gallery modal (opened via ?modal=gallery) */}
        <FullGalleryModal images={images} />

        <CarDetailActions car={car} dealerRating={dealerRating} />

        {/* Report / Mark Unavailable section (full-width on mobile) */}
        <ReportUnavailSection carId={car.id} isLoggedIn={!!user} />

        <section className="py-8 px-3 sm:px-4 md:px-6">
          <div className="md:max-w-[70%]">
            <Suspense fallback={<SimilarCarsSkeletonFallback />}>
              <SimilarCars currentCarId={car.id} />
            </Suspense>
          </div>
        </section>

        {/* <div className="hidden md:flex fixed top-1/2 -right-4 -rotate-90 origin-right bg-yellow-400 text-black px-8 py-3 rounded-tl-2xl rounded-tr-2xl font-black text-xl shadow-2xl z-40 animate-pulse">
          <Link href="/careers" className="flex items-center gap-3">
            <Briefcase size={20} /> WE ARE HIRING!
          </Link>
        </div> */}
      </div>
    </main>
  );
}
