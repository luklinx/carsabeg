// src/components/CarDetailActions.tsx
"use client";

import { useState } from "react";
import { AlertTriangle, AlertCircle, Star, X } from "lucide-react";
import { Car } from "@/types";

interface Props {
  car: Car;
  dealerAdsCount: number;
  dealerRating: {
    average: number;
    total: number;
  };
}

export default function CarDetailActions({
  car,
  dealerAdsCount,
  dealerRating,
}: Props) {
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
        body: JSON.stringify({
          dealer_id: car.id,
          rating,
          comment: feedback,
          user_email: userEmail,
        }),
      });

      const data = await res.json();
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
      setMessage("Error submitting feedback");
      console.error(err);
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

      const data = await res.json();
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
      setMessage("Error submitting report");
      console.error(err);
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
        body: JSON.stringify({
          car_id: car.id,
          reason: "Marked as unavailable by user",
        }),
      });

      const data = await res.json();
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
      setMessage("Error updating status");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Seller Info Section */}
      <section className="container mx-auto px-3 sm:px-4 md:px-6 py-12 md:py-16 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl sm:rounded-3xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-6 md:mb-8">
            About the Seller
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {/* Seller Name & Contact */}
            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-md">
              <p className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wide mb-2">
                Seller Name
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 mb-4">
                {car.dealer_name || "Cars Abeg Verified Dealer"}
              </p>
              <p className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wide mb-2">
                Contact
              </p>
              <a
                href={`tel:${car.dealer_phone}`}
                className="text-green-600 font-bold text-base sm:text-lg hover:underline"
              >
                {car.dealer_phone}
              </a>
            </div>

            {/* Number of Ads */}
            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-md">
              <p className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wide mb-2">
                Active Listings
              </p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-black text-green-600 mb-4">
                {dealerAdsCount}
              </p>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">
                This seller has {dealerAdsCount} active{" "}
                {dealerAdsCount === 1 ? "car" : "cars"} for sale
              </p>
            </div>
          </div>

          {/* Leave Feedback */}
          <div className="bg-white p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-md">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <Star size={28} className="text-yellow-500" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900">
                Seller Rating
              </h3>
            </div>
            <div className="flex gap-2 mb-6">
              {dealerRating.average > 0 ? (
                <>
                  <div className="text-4xl font-black text-yellow-500">
                    {dealerRating.average}
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-2xl ${
                          i < Math.round(dealerRating.average)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {dealerRating.total}{" "}
                    {dealerRating.total === 1 ? "review" : "reviews"}
                  </div>
                </>
              ) : (
                <p className="text-gray-600 font-medium">No reviews yet</p>
              )}
            </div>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all hover:scale-105"
            >
              Leave Feedback About This Seller
            </button>
          </div>
        </div>
      </section>

      {/* Safety Tips Section */}
      <section className="container mx-auto px-3 sm:px-4 md:px-6 py-12 md:py-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl sm:rounded-3xl shadow-lg">
        <div className="max-w-4xl mx-auto">
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

      {/* Action Buttons */}
      <section className="container mx-auto px-3 sm:px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <button
            onClick={() => setShowUnavailableModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white py-4 sm:py-5 md:py-6 px-6 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 sm:gap-3"
          >
            <AlertTriangle size={24} /> Mark as Unavailable
          </button>
          <button
            onClick={() => setShowAbuseModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white py-4 sm:py-5 md:py-6 px-6 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 sm:gap-3"
          >
            <AlertCircle size={24} /> Report Abuse
          </button>
        </div>
      </section>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start gap-4 mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-black">Leave Feedback</h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-gray-500 hover:text-gray-700 flex-shrink-0"
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

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-3">
                  Rating
                </label>
                <div className="flex gap-1 sm:gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl sm:text-3xl md:text-4xl transition transform hover:scale-110 ${
                        star <= rating
                          ? "text-yellow-400"
                          : "text-gray-300 hover:text-yellow-200"
                      }`}
                    >
                      ★
                    </button>
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
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  rows={3}
                  placeholder="Share your experience..."
                />
              </div>

              <button
                onClick={handleFeedbackSubmit}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-black transition"
              >
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Abuse Modal */}
      {showAbuseModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start gap-4 mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-black">Report Abuse</h3>
              <button
                onClick={() => setShowAbuseModal(false)}
                className="text-gray-500 hover:text-gray-700 flex-shrink-0"
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

              <button
                onClick={handleAbuseReport}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-black transition"
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
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
                className="text-gray-500 hover:text-gray-700 flex-shrink-0"
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

            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={() => setShowUnavailableModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-black transition"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkUnavailable}
                disabled={loading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-black transition"
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
