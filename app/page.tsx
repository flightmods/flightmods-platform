"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  buildTrendingAddons,
  type AddonWithTrending,
  type Rating,
} from "@/lib/trending";

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

export default function Home() {
  const [featured, setFeatured] = useState<Addon | null>(null);
  const [latest, setLatest] = useState<Addon[]>([]);
  const [trending, setTrending] = useState<AddonWithTrending<Addon>[]>([]);
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
      const trendingData = buildTrendingAddons(addons, ratings);

      setFeatured(featuredRows?.[0] ?? null);
      setLatest((latestData as Addon[]) || []);
      setTrending(trendingData.slice(0, 6));
      setLoading(false);
    };

    fetchData();
  }, []);

  const totalVisibleAddons = latest.length || trending.length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1120] to-black text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-260px] h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-blue-500/25 blur-[170px]" />
        <div className="absolute right-[-140px] top-[18%] h-[440px] w-[440px] rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="absolute left-[-130px] bottom-[12%] h-[380px] w-[380px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div
        className="absolute inset-0 -z-10 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-12">
        <section className="mb-20 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
              New home for MSFS & X-Plane addons
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
              Discover better flight sim addons.
            </h1>

            <p className="mb-8 max-w-2xl text-lg leading-8 text-zinc-300">
              FlightMods is a growing platform for Microsoft Flight Simulator
              and X-Plane creators. Browse aircraft, liveries, scenery,
              utilities and community-made mods in one clean place.
            </p>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/addons"
                className="rounded-2xl bg-blue-600 px-7 py-4 text-center font-semibold shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
              >
                Browse Addons
              </Link>

              <Link
                href="/register"
                className="rounded-2xl border border-zinc-700 bg-zinc-900/70 px-7 py-4 text-center font-semibold transition hover:border-zinc-500 hover:bg-zinc-800"
              >
                Create Account
              </Link>

              <Link
                href="/upload"
                className="rounded-2xl bg-zinc-800 px-7 py-4 text-center font-semibold transition hover:bg-zinc-700"
              >
                Upload Addon
              </Link>
            </div>

            <div className="grid max-w-xl grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-2xl font-bold">{totalVisibleAddons}+</p>
                <p className="text-zinc-500">Addons listed</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-2xl font-bold">Free</p>
                <p className="text-zinc-500">Community mods</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                <p className="text-2xl font-bold">Review</p>
                <p className="text-zinc-500">Creator uploads</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900/60 p-5 shadow-2xl shadow-blue-950/30 backdrop-blur">
            {featured?.image_url ? (
              <img
                src={featured.image_url}
                alt={featured.title}
                className="mb-5 h-64 w-full rounded-3xl object-cover"
              />
            ) : (
              <div className="mb-5 flex h-64 w-full items-center justify-center rounded-3xl bg-zinc-950 text-zinc-500">
                Featured addon preview
              </div>
            )}

            <p className="mb-2 text-sm font-medium text-blue-300">
              ⭐ Featured Addon
            </p>

            <h2 className="mb-3 text-2xl font-bold">
              {featured?.title ?? "Your addon could be featured here"}
            </h2>

            <p className="mb-5 line-clamp-3 text-sm leading-7 text-zinc-400">
              {featured
                ? featured.description
                : "Upload your first aircraft, livery, scenery or utility and become part of the FlightMods creator community."}
            </p>

            <div className="flex items-center justify-between gap-4">
              <Link
                href={featured ? `/addons/${featured.id}` : "/upload"}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-700"
              >
                {featured ? "View Featured" : "Upload Now"}
              </Link>

              <span className="text-sm text-zinc-500">
                {featured ? `${featured.downloads} downloads` : "Creator space"}
              </span>
            </div>
          </div>
        </section>

        <section className="mb-16 rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                For pilots
              </p>
              <h3 className="mb-2 text-xl font-bold">Find new addons faster</h3>
              <p className="text-sm leading-7 text-zinc-400">
                Browse selected community uploads for MSFS 2020, MSFS 2024 and
                X-Plane without clutter.
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                For creators
              </p>
              <h3 className="mb-2 text-xl font-bold">Share your work</h3>
              <p className="text-sm leading-7 text-zinc-400">
                Upload your mods, manage your creator profile and build
                visibility for your projects.
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Community
              </p>
              <h3 className="mb-2 text-xl font-bold">Join the early phase</h3>
              <p className="text-sm leading-7 text-zinc-400">
                FlightMods is still growing. Early creators help shape the
                platform from the beginning.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Fresh uploads
              </p>
              <h2 className="text-3xl font-bold">Latest Addons</h2>
            </div>

            <Link
              href="/addons"
              className="rounded-xl bg-zinc-800 px-4 py-2 text-sm transition hover:bg-zinc-700"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <p className="text-zinc-400">Loading...</p>
          ) : latest.length === 0 ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 text-zinc-400">
              No addons yet. Be the first creator to upload one.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {latest.map((addon) => (
                <Link
                  key={addon.id}
                  href={`/addons/${addon.id}`}
                  className="group border border-zinc-800 rounded-2xl p-4 bg-zinc-900/60 backdrop-blur hover:bg-zinc-800/70 transition"
                >
                  {addon.image_url ? (
                    <img
                      src={addon.image_url}
                      alt={addon.title}
                      className="w-full h-44 object-cover rounded-xl mb-4 group-hover:scale-[1.01] transition"
                    />
                  ) : (
                    <div className="mb-4 h-44 w-full rounded-xl bg-zinc-950" />
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

        <section className="mb-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Popular now
              </p>
              <h2 className="text-3xl font-bold">🔥 Trending Addons</h2>
            </div>

            <Link
              href="/addons"
              className="rounded-xl bg-zinc-800 px-4 py-2 text-sm transition hover:bg-zinc-700"
            >
              Explore library
            </Link>
          </div>

          {loading ? (
            <p className="text-zinc-400">Loading...</p>
          ) : trending.length === 0 ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 text-zinc-400">
              Trending addons will appear here once downloads and ratings grow.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {trending.map((addon, index) => (
                <Link
                  key={addon.id}
                  href={`/addons/${addon.id}`}
                  className="group relative border border-zinc-800 rounded-2xl p-4 bg-zinc-900/60 backdrop-blur hover:bg-zinc-800/70 transition"
                >
                  <div className="absolute left-6 top-6 z-10 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur">
                    #{index + 1}
                  </div>

                  {addon.image_url ? (
                    <img
                      src={addon.image_url}
                      alt={addon.title}
                      className="w-full h-44 object-cover rounded-xl mb-4 group-hover:scale-[1.01] transition"
                    />
                  ) : (
                    <div className="mb-4 h-44 w-full rounded-xl bg-zinc-950" />
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

        <section className="rounded-3xl border border-blue-400/20 bg-blue-500/10 p-8 text-center backdrop-blur">
          <h2 className="mb-3 text-3xl font-bold">Are you a creator?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-zinc-300">
            Upload your first addon, create your public creator profile and help
            build the FlightMods library from the beginning.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/upload"
              className="rounded-2xl bg-blue-600 px-7 py-4 font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Upload your addon
            </Link>

            <a
              href="https://discord.gg/SxxDtTcX"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-indigo-600 px-7 py-4 font-semibold shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
            >
              Join Discord
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}