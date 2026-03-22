"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type UserLike = {
  id: string;
};

export default function RatingSection({ addonId }: { addonId: string }) {
  const [user, setUser] = useState<UserLike | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [average, setAverage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    loadUser();
    loadRatings();
  }, [addonId]);

  async function loadUser() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user ?? null);
  }

  async function loadRatings() {
    const { data, error } = await supabase
      .from("ratings")
      .select("*")
      .eq("addon_id", addonId);

    if (!error && data) {
      const ratings = data as any[];

      if (ratings.length > 0) {
        const avg =
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

        setAverage(avg);
        setCount(ratings.length);
      }

      const { data: userData } = await supabase.auth.getUser();

      if (userData.user) {
        const userRating = ratings.find(
          (r) => r.user_id === userData.user?.id
        );

        if (userRating) {
          setRating(userRating.rating);
        }
      }
    }
  }

  async function handleRate(value: number) {
    if (!user) {
      alert("Please log in to rate.");
      return;
    }

    const { error } = await supabase.from("ratings").upsert(
      {
        addon_id: addonId,
        user_id: user.id,
        rating: value,
      },
      { onConflict: "addon_id,user_id" }
    );

    if (error) {
      alert("Failed to submit rating");
      return;
    }

    setRating(value);
    loadRatings();
  }

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
      <h2 className="mb-4 text-2xl font-bold">Rating</h2>

      <div className="mb-4 flex items-center gap-3">
        <span className="text-3xl font-bold">
          {average ? average.toFixed(1) : "–"}
        </span>
        <span className="text-zinc-400 text-sm">
          ({count} ratings)
        </span>
      </div>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            className={`text-2xl transition ${
              rating && star <= rating
                ? "text-yellow-400"
                : "text-zinc-600 hover:text-yellow-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </section>
  );
}