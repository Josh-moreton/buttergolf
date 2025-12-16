"use client";

import { useState, useEffect } from "react";

interface Rating {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

interface OrderRatingProps {
  orderId: string;
  isDelivered: boolean;
  isBuyer: boolean;
  sellerName: string;
}

export function OrderRating({
  orderId,
  isDelivered,
  isBuyer,
  sellerName,
}: OrderRatingProps) {
  const [rating, setRating] = useState<Rating | null>(null);
  const [canRate, setCanRate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}/rating`);
        if (response.ok) {
          const data = await response.json();
          setRating(data.rating);
          setCanRate(data.canRate);
        }
      } catch (err) {
        console.error("Failed to fetch rating:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [orderId]);

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      setError("Please select a rating");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${orderId}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: selectedRating,
          comment: comment.trim() || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit rating");
      }

      const data = await response.json();
      setRating(data.rating);
      setCanRate(false);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  // Don't show anything if loading
  if (loading) {
    return null;
  }

  // Don't show if not delivered yet
  if (!isDelivered) {
    return null;
  }

  // Show existing rating
  if (rating) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Seller Rating</h2>
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-2xl ${
                star <= rating.rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
          <span className="text-lg font-medium ml-2">{rating.rating}/5</span>
        </div>
        {rating.comment && (
          <p className="text-gray-600 mt-2">&quot;{rating.comment}&quot;</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          Rated on {new Date(rating.createdAt).toLocaleDateString()}
        </p>
      </div>
    );
  }

  // Show rating form for buyer only
  if (!isBuyer || !canRate) {
    return null;
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-green-800 mb-2">Thank You!</h2>
        <p className="text-green-700">
          Your rating has been submitted. Thanks for helping build trust in our
          marketplace!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Rate Your Experience</h2>
      <p className="text-gray-600 mb-4">
        How was your experience with {sellerName || "this seller"}?
      </p>

      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setSelectedRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="text-3xl focus:outline-none transition-transform hover:scale-110"
          >
            <span
              className={
                star <= (hoverRating || selectedRating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }
            >
              ★
            </span>
          </button>
        ))}
        {selectedRating > 0 && (
          <span className="ml-2 text-gray-600">
            {selectedRating === 1 && "Poor"}
            {selectedRating === 2 && "Fair"}
            {selectedRating === 3 && "Good"}
            {selectedRating === 4 && "Very Good"}
            {selectedRating === 5 && "Excellent"}
          </span>
        )}
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comment (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={3}
          maxLength={500}
          className="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={submitting || selectedRating === 0}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {submitting ? "Submitting..." : "Submit Rating"}
      </button>
    </div>
  );
}
