// src/components/CarDetailActions.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Star, X, CheckCircle } from "lucide-react";
import { Car } from "@/types";
import CustomButton from "@/components/CustomButton";

interface Props {
  car: Car;
  dealerRating: {
    average: number;
    total: number;
  };
}

type ApiResponse = { error?: string; [key: string]: unknown };

export default function CarDetailActions({ car, dealerRating }: Props) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAbuseModal, setShowAbuseModal] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [abuseReason, setAbuseReason] = useState("");
  const [abuseDetails, setAbuseDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  // We keep the modal logic but avoid rendering the inline UI sections here so
  // they can be explicitly placed in the left/right columns by the page layout.
  const showInlineSections = false;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/check", { credentials: "include" });
        if (!mounted) return;
        setIsLoggedIn(res.ok);

        if (res.ok) {
          // Prefill user email when logged in
          const profileRes = await fetch("/api/users/profile", {
            credentials: "include",
          });
          if (!mounted) return;
          if (profileRes.ok) {
            const json = await profileRes.json();
            setUserEmail(json.user?.email ?? "");
          }
        }
      } catch {
        if (!mounted) return;
        setIsLoggedIn(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showFeedbackModal) setShowFeedbackModal(false);
        if (showAbuseModal) setShowAbuseModal(false);
        if (showUnavailableModal) setShowUnavailableModal(false);
      }
    };
    if (showFeedbackModal || showAbuseModal || showUnavailableModal) {
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [showFeedbackModal, showAbuseModal, showUnavailableModal]);

  // listen for external requests to open the rating modal (e.g., from SellerCard)
  useEffect(() => {
    const handler = () => {
      if (isLoggedIn === null) return; // still checking
      if (isLoggedIn) setShowFeedbackModal(true);
      else router.push("/auth/signin");
    };
    window.addEventListener("open-feedback", handler as EventListener);
    return () =>
      window.removeEventListener("open-feedback", handler as EventListener);
  }, [isLoggedIn, router]);

  // listen for external requests to open the unavailable modal (e.g., from SellerCard)
  useEffect(() => {
    const handler2 = () => {
      if (isLoggedIn === null) return; // still checking
      if (isLoggedIn) setShowUnavailableModal(true);
      else router.push("/auth/signin");
    };
    window.addEventListener("open-unavailable", handler2 as EventListener);
    return () =>
      window.removeEventListener("open-unavailable", handler2 as EventListener);
  }, [isLoggedIn, router]);

  const handleFeedbackSubmit = async () => {
    if (!userEmail || !rating) {
      setMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cars/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          dealer_id: car.id,
          rating,
          comment: feedback,
          // we still accept user_email for non-auth flows, server will prefer
          // authenticated user's email when available
          user_email: userEmail,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as ApiResponse;
      if (res.ok) {
        setMessage("Feedback submitted! Thank you.");
        setTimeout(() => {
          setShowFeedbackModal(false);
          setMessage("");
          setUserEmail("");
          setRating(5);
          setFeedback("");
        }, 1500);
      } else {
        setMessage(data.error || "Failed to submit feedback");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error submitting feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleAbuseReport = async () => {
    if (!abuseReason) {
      setMessage("Please select a reason");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cars/report-abuse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          car_id: car.id,
          dealer_id: car.dealer_name,
          reason: abuseReason,
          details: abuseDetails,
          user_email: userEmail || "anonymous",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as ApiResponse;
      if (res.ok) {
        setMessage("Report submitted! Our team will review it.");
        setTimeout(() => {
          setShowAbuseModal(false);
          setMessage("");
          setAbuseReason("");
          setAbuseDetails("");
          setUserEmail("");
        }, 1500);
      } else {
        setMessage(data.error || "Failed to submit report");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error submitting report");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkUnavailable = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cars/mark-unavailable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          car_id: car.id,
          reason: "Marked as unavailable by user",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as ApiResponse;
      if (res.ok) {
        setMessage("Thank you! We've recorded this.");
        setTimeout(() => {
          setShowUnavailableModal(false);
          setMessage("");
        }, 1500);
      } else {
        setMessage(data.error || "Failed to update");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error updating status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showInlineSections && (
        <>
          <section className="py-3 px-3 sm:px-4 md:px-6">
            <div className="w-full">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Star size={20} className="text-yellow-500" />
                    <div className="min-w-0">
                      {dealerRating.average > 0 ? (
                        <div className="flex items-baseline gap-2">
                          <div className="text-base font-black text-yellow-500">
                            {dealerRating.average}
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {dealerRating.total}{" "}
                            {dealerRating.total === 1 ? "review" : "reviews"}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-600">
                          No reviews yet
                        </div>
                      )}
                      <div className="text-xs text-gray-600 hidden sm:block">
                        Honest reviews from buyers — help others.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CustomButton
                      btnType="button"
                      handleClick={() => {
                        if (isLoggedIn === null) return;
                        if (isLoggedIn) setShowFeedbackModal(true);
                        else router.push("/auth/signin");
                      }}
                      containerStyles="inline-flex px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md font-bold text-sm"
                      title="Rate"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Book for Inspection (compact) — left aligned; CTA placed inside */}
          <section className="py-3 px-3 sm:px-4 md:px-6">
            <div className="w-full">
              <div className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between gap-4">
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
                  <button
                    onClick={() => {
                      if (isLoggedIn === null) return;
                      if (isLoggedIn) {
                        // notify listeners (CarDetailClient listens and will open its modal)
                        window.dispatchEvent(
                          new CustomEvent("open-inspection")
                        );
                      } else router.push("/auth/signin");
                    }}
                    className="inline-flex px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-bold"
                    aria-label="Book inspection"
                  >
                    Book inspection
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Safety Tips Section — left aligned */}
          <section className="py-12 md:py-16 px-3 sm:px-4 md:px-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl sm:rounded-3xl shadow-lg">
            <div className="w-full">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 md:mb-8">
                <AlertCircle size={32} className="text-red-600 flex-shrink-0" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900">
                  Safety Tips
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  {
                    icon: "🔒",
                    title: "Meet in Safe Places",
                    desc: "Always meet the seller in a public location during daylight",
                  },
                  {
                    icon: "✓",
                    title: "Verify Identity",
                    desc: "Ask for government-issued ID and confirm seller details",
                  },
                  {
                    icon: "🔧",
                    title: "Get Vehicle Inspection",
                    desc: "Have a trusted mechanic inspect the car before payment",
                  },
                  {
                    icon: "💳",
                    title: "Use Secure Payment",
                    desc: "Never send money via wire; use escrow or bank transfer",
                  },
                ].map((tip, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-lg transition"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <span className="text-3xl mt-1">{tip.icon}</span>
                      <div>
                        <h3 className="font-black text-gray-900 text-base sm:text-lg md:text-xl mb-2">
                          {tip.title}
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                          {tip.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div
          onClick={() => setShowFeedbackModal(false)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start gap-4 mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-black">
                Rate this seller
              </h3>
              <CustomButton
                handleClick={() => setShowFeedbackModal(false)}
                containerStyles="text-gray-600 hover:text-gray-700 flex-shrink-0"
                aria-label="Close feedback"
              >
                <X size={24} className="sm:w-7 sm:h-7" />
              </CustomButton>
            </div>

            {message && (
              <div
                className={`mb-4 p-3 sm:p-4 rounded-lg font-bold text-sm sm:text-base ${
                  message.includes("Thank")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-3">
                  Rating
                </label>
                <div className="flex gap-1 sm:gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <CustomButton
                      key={star}
                      handleClick={() => setRating(star)}
                      containerStyles={`text-2xl sm:text-3xl md:text-4xl transition transform hover:scale-110 ${
                        star <= rating
                          ? "text-yellow-400"
                          : "text-gray-300 hover:text-yellow-200"
                      }`}
                    >
                      ★
                    </CustomButton>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                  Your Feedback (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
                  rows={3}
                  placeholder="Share your experience..."
                />
              </div>

              <div className="flex items-center justify-center">
                <CustomButton
                  btnType="button"
                  isDisabled={loading}
                  handleClick={handleFeedbackSubmit}
                  containerStyles="inline-flex px-4 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm sm:text-base rounded-lg font-black transition"
                  title={loading ? "Submitting..." : "Submit Rating"}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Abuse Modal */}
      {showAbuseModal && (
        <div
          onClick={() => setShowAbuseModal(false)}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start gap-4 mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-black">Report Abuse</h3>
              <CustomButton
                handleClick={() => setShowAbuseModal(false)}
                containerStyles="text-gray-600 hover:text-gray-700 flex-shrink-0"
                aria-label="Close report"
              >
                <X size={24} className="sm:w-7 sm:h-7" />
              </CustomButton>
            </div>

            {message && (
              <div
                className={`mb-4 p-3 sm:p-4 rounded-lg font-bold text-sm sm:text-base ${
                  message.includes("Thank")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                  Reason for Report
                </label>
                <select
                  value={abuseReason}
                  onChange={(e) => setAbuseReason(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="">Select a reason...</option>
                  <option value="fake_listing">Fake Listing</option>
                  <option value="misleading_info">
                    Misleading Information
                  </option>
                  <option value="scam">Potential Scam</option>
                  <option value="harassment">Harassment</option>
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                  Details (Optional)
                </label>
                <textarea
                  value={abuseDetails}
                  onChange={(e) => setAbuseDetails(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                  rows={3}
                  placeholder="Please provide details..."
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="your@email.com"
                />
              </div>

              <div className="flex items-center justify-center">
                <CustomButton
                  btnType="button"
                  isDisabled={loading}
                  handleClick={handleAbuseReport}
                  containerStyles="inline-flex px-4 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm sm:text-base rounded-lg font-black transition"
                  title={loading ? "Submitting..." : "Submit Report"}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mark Unavailable Modal */}
      {showUnavailableModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 md:p-8">
            <div className="flex justify-between items-start gap-4 mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-black">
                Mark as Unavailable
              </h3>
              <button
                onClick={() => setShowUnavailableModal(false)}
                className="text-gray-600 hover:text-gray-700 flex-shrink-0"
              >
                <X size={24} className="sm:w-7 sm:h-7" />
              </button>
            </div>

            {message && (
              <div
                className={`mb-4 p-3 sm:p-4 rounded-lg font-bold text-sm sm:text-base ${
                  message.includes("Thank")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message}
              </div>
            )}

            <p className="text-gray-700 mb-6 leading-relaxed text-sm sm:text-base">
              Help other buyers by marking this car as unavailable if you know
              it has been sold or is no longer for sale.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
              <CustomButton
                btnType="button"
                handleClick={() => setShowUnavailableModal(false)}
                containerStyles="inline-flex px-4 py-2.5 sm:py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-black transition"
                title="Cancel"
              />
              <CustomButton
                btnType="button"
                isDisabled={loading}
                handleClick={handleMarkUnavailable}
                containerStyles="inline-flex px-4 py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-lg font-black transition"
                title={loading ? "Processing..." : "Confirm"}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
