"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Addon = {
  id: string;
  title: string;
  description: string;
  image_url?: string | null;
  downloads: number;
  author?: string;
  author_name?: string;
  created_at: string;
};

type Rating = {
  addon_id: string;
  rating: number;
};

type AddonWithTrending = Addon & {
  averageRating: number;
  ratingCount: number;
  trendingScore: number;
};

function calculateTrendingScore(
  downloads: number,
  averageRating: number,
  ratingCount: number,
  createdAt: string
) {
  const now = new Date().getTime();
  const created = new Date(createdAt).getTime();
  const ageInDays = Math.max(1, (now - created) / (1000 * 60 * 60 * 24));

  const downloadScore = downloads * 0.7;
  const ratingScore = averageRating * 15;
  const ratingCountScore = ratingCount * 4;
  const freshnessScore = 30 / ageInDays;

  return downloadScore + ratingScore + ratingCountScore + freshnessScore;
}

export default function Home() {
  const [featured, setFeatured] = useState<Addon | null>(null);
  const [latest, setLatest] = useState<Addon[]>([]);
  const [trending, setTrending] = useState<AddonWithTrending[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: featuredRows } = await supabase
        .from("addons")
        .select("*")
        .eq("status", "approved")
        .order("downloads", { ascending: false })
        .limit(1);

      const { data: latestData } = await supabase
        .from("addons")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(6);

      const { data: allApprovedAddons } = await supabase
        .from("addons")
        .select("*")
        .eq("status", "approved");

      const { data: ratingsData } = await supabase
        .from("ratings")
        .select("addon_id, rating");

      const addons = (allApprovedAddons as Addon[]) || [];
      const ratings = (ratingsData as Rating[]) || [];

      const trendingData: AddonWithTrending[] = addons.map((addon) => {
        const addonRatings = ratings.filter((r) => r.addon_id === addon.id);
        const ratingCount = addonRatings.length;
        const averageRating =
          ratingCount > 0
            ? addonRatings.reduce((sum, r) => sum + r.rating, 0) / ratingCount
            : 0;

        const trendingScore = calculateTrendingScore(
          addon.downloads ?? 0,
          averageRating,
          ratingCount,
          addon.created_at
        );

        return {
          ...addon,
          averageRating,
          ratingCount,
          trendingScore,
        };
      });

      trendingData.sort((a, b) => b.trendingScore - a.trendingScore);

      setFeatured(featuredRows?.[0] ?? null);
      setLatest((latestData as Addon[]) || []);
      setTrending(trendingData.slice(0, 6));
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1120] to-black text-white">
      {/* Glow Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[160px]" />
        <div className="absolute right-[-120px] top-[20%] h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="absolute left-[-120px] bottom-[10%] h-[360px] w-[360px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Featured Addon */}
        {featured && (
          <section className="mb-16">
            <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur">
              {featured.image_url && (
                <img
                  src={featured.image_url}
                  alt={featured.title}
                  className="w-full h-[320px] object-cover"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-center p-10">
                <p className="text-blue-400 text-sm mb-2">⭐ Featured Addon</p>

                <h2 className="text-3xl md:text-5xl font-bold mb-3 max-w-2xl">
                  {featured.title}
                </h2>

                <p className="text-zinc-200 max-w-3xl mb-6 text-lg leading-7">
                  {featured.description.length > 140
                    ? featured.description
                        .substring(0, 140)
                        .split(" ")
                        .slice(0, -1)
                        .join(" ") + "..."
                    : featured.description}
                </p>

                <div className="flex gap-4 items-center">
                  <Link
                    href={`/addons/${featured.id}`}
                    className="bg-blue-600 shadow-lg shadow-blue-600/20 px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Addon
                  </Link>

                  <span className="text-sm text-zinc-400">
                    {featured.downloads} downloads
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">FlightMods</h1>

          <p className="text-zinc-400 mb-8">
            Your platform for Flight Simulator addons
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href="/addons"
              className="bg-blue-600 shadow-lg shadow-blue-600/20 px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Explore Addons
            </Link>

            <Link
              href="/upload"
              className="bg-zinc-800 px-6 py-3 rounded-lg hover:bg-zinc-700 transition"
            >
              Upload Addon
            </Link>
          </div>
        </section>

        {/* Latest Addons */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Latest Addons</h2>

          {loading ? (
            <p className="text-zinc-400">Loading...</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {latest.map((addon) => (
                <Link
                  key={addon.id}
                  href={`/addons/${addon.id}`}
                  className="group border border-zinc-800 rounded-2xl p-4 bg-zinc-900/60 backdrop-blur hover:bg-zinc-800/70 transition"
                >
                  {addon.image_url && (
                    <img
                      src={addon.image_url}
                      alt={addon.title}
                      className="w-full h-44 object-cover rounded-xl mb-4 group-hover:scale-[1.01] transition"
                    />
                  )}

                  <h3 className="text-lg font-semibold group-hover:text-blue-400">
                    {addon.title}
                  </h3>

                  <p className="text-xs text-zinc-500 mt-1">
                    by {addon.author_name ?? addon.author ?? "Unknown"}
                  </p>

                  <p className="text-sm text-zinc-400 mt-3 line-clamp-2">
                    {addon.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Trending */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">🔥 Trending Addons</h2>

          {loading ? (
            <p className="text-zinc-400">Loading...</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {trending.map((addon) => (
                <Link
                  key={addon.id}
                  href={`/addons/${addon.id}`}
                  className="group border border-zinc-800 rounded-2xl p-4 bg-zinc-900/60 backdrop-blur hover:bg-zinc-800/70 transition"
                >
                  {addon.image_url && (
                    <img
                      src={addon.image_url}
                      alt={addon.title}
                      className="w-full h-44 object-cover rounded-xl mb-4 group-hover:scale-[1.01] transition"
                    />
                  )}

                  <h3 className="text-lg font-semibold group-hover:text-blue-400">
                    {addon.title}
                  </h3>

                  <p className="text-xs text-zinc-500 mt-1">
                    by {addon.author_name ?? addon.author ?? "Unknown"}
                  </p>

                  <p className="text-sm text-zinc-400 mt-3 line-clamp-2">
                    {addon.description}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-zinc-500">
                    <p>{addon.downloads} downloads</p>
                    <p>
                      {addon.ratingCount > 0
                        ? `${addon.averageRating.toFixed(1)}★ (${addon.ratingCount} ratings)`
                        : "No ratings yet"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}