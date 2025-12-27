"use client";

import { useState, useEffect } from "react";
import SellerCard from "@/components/SellerCard";
import FloatingCarBar from "@/components/FloatingCarBar";
import BookInspectionModal from "@/components/BookInspectionModal";
import FinanceCalculator from "@/components/FinanceCalculator";
import { Car } from "@/types";

interface Props {
  car: Car;
  formattedPrice: string;
  images: string[];
  dealerAdsCount: number;
  dealerRating: { average: number; total: number };
  isLoggedIn?: boolean;
  sellerProfile?: {
    id: string;
    full_name?: string | null;
    profile_photo_url?: string | null;
    created_at?: string | null;
  } | null;
  sellerListingsCount?: number;
}

export default function CarDetailClient({
  car,
  formattedPrice,
  images,
  dealerAdsCount,
  dealerRating,
  isLoggedIn = false,
  sellerProfile,
  sellerListingsCount,
}: Props) {
  const [inspectionOpen, setInspectionOpen] = useState(false);
  const [showFinance] = useState(false);

  // listen for global requests to open the inspection modal
  useEffect(() => {
    function handleOpen() {
      setInspectionOpen(true);
    }
    window.addEventListener("open-inspection", handleOpen as EventListener);
    return () =>
      window.removeEventListener(
        "open-inspection",
        handleOpen as EventListener
      );
  }, []);

  return (
    <>
      <FloatingCarBar
        title={`${car.year} ${car.make} ${car.model}`}
        price={`₦${formattedPrice}`}
        sellerName={sellerProfile?.full_name || car.dealer_name}
        sellerAvatar={sellerProfile?.profile_photo_url ?? undefined}
        sellerJoined={sellerProfile?.created_at ?? undefined}
        listingsCount={sellerListingsCount ?? undefined}
        listingsUrl={
          sellerProfile?.id
            ? `/seller/${sellerProfile.id}`
            : `/inventory?dealer=${encodeURIComponent(car.dealer_name)}`
        }
        rating={dealerRating}
        isVerified={!!dealerRating?.total}
        whatsappUrl={`https://wa.me/${car.dealer_phone
          ?.replace(/\D/g, "")
          .replace(/^0/, "234")}`}
        phone={car.dealer_phone}
        image={images && images[0]}
        targetId="basic-info"
        compact
      />

      {/* Desktop seller card (beside images on lg+) */}
      <div className="hidden lg:block mt-4">
        <SellerCard
          dealerName={car.dealer_name}
          dealerPhone={car.dealer_phone}
          dealerAdsCount={dealerAdsCount}
          dealerRating={dealerRating}
          make={car.make}
          model={car.model}
          carId={car.id}
          isVerified={!!dealerRating?.total}
          isLoggedIn={isLoggedIn}
          sellerProfile={sellerProfile}
          sellerListingsCount={sellerListingsCount}
        />

        {/* Rating (right column, immediately after seller) */}
        <div className="mt-4 bg-white p-3 rounded-lg shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-yellow-500 font-black text-lg">
                {dealerRating.average > 0 ? dealerRating.average : "--"}
              </div>
              <div className="text-sm text-gray-600">
                {dealerRating.total}{" "}
                {dealerRating.total === 1 ? "review" : "reviews"}
              </div>
            </div>

            <div>
              <button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("open-feedback"))
                }
                className="inline-flex px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-bold"
              >
                Rate
              </button>
            </div>
          </div>
        </div>

        {/* Finance calculator (desktop) — aligned to right column below seller card */}
        <div className="mt-4">
          <div className="bg-white p-4 rounded-2xl shadow border border-gray-100">
            <FinanceCalculator price={Number(car.price || 0)} />
          </div>
        </div>
      </div>

      {/* Mobile seller card (below images on small screens) */}
      <div className="lg:hidden mt-4 px-3">
        <SellerCard
          dealerName={car.dealer_name}
          dealerPhone={car.dealer_phone}
          dealerAdsCount={dealerAdsCount}
          dealerRating={dealerRating}
          make={car.make}
          model={car.model}
          carId={car.id}
          isVerified={!!dealerRating?.total}
          isLoggedIn={isLoggedIn}
          sellerProfile={sellerProfile}
          sellerListingsCount={sellerListingsCount}
        />

        {/* Finance calculator (mobile) placed below seller card for discoverability */}
        <div className="mt-4 px-0">
          <div className="bg-white p-4 rounded-2xl shadow border border-gray-100">
            <FinanceCalculator price={Number(car.price || 0)} />
          </div>
        </div>
      </div>

      {/* On desktop, show finance inline in aside area by toggling a region; on mobile it's above */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 mt-6">
        {showFinance && (
          <div className="max-w-4xl mx-auto">
            <FinanceCalculator price={Number(car.price || 0)} />
          </div>
        )}
      </div>

      <BookInspectionModal
        open={inspectionOpen}
        onClose={() => setInspectionOpen(false)}
        carId={car.id}
      />
    </>
  );
}
