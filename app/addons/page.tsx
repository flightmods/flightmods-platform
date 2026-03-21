"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import DownloadButton from "@/components/DownloadButton";

type Addon = {
  id: string;
  title: string;
  description: string;
  author: string;
  author_name?: string;
  file_url: string;
  image_url?: string;
  version: string;
  downloads: number;
  created_at: string;
  sim: string;
  category: string;
};

export default function AddonsPage() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [simFilter, setSimFilter] = useState("Alle");
  const [categoryFilter, setCategoryFilter] = useState("Alle");

  useEffect(() => {
    const loadAddons = async () => {
      const { data, error } = await supabase
        .from("addons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading add-ons:", error.message);
      } else if (data) {
        setAddons(data as Addon[]);
      }

      setLoading(false);
    };

    loadAddons();
  }, []);

  const filteredAddons = useMemo(() => {
    return addons.filter((addon) => {
      const authorText = (addon.author_name ?? addon.author ?? "").toLowerCase();

      const matchesSearch =
        addon.title.toLowerCase().includes(search.toLowerCase()) ||
        addon.description.toLowerCase().includes(search.toLowerCase()) ||
        authorText.includes(search.toLowerCase());

      const matchesSim = simFilter === "Alle" || addon.sim === simFilter;
      const matchesCategory =
        categoryFilter === "Alle" || addon.category === categoryFilter;

      return matchesSearch && matchesSim && matchesCategory;
    });
  }, [addons, search, simFilter, categoryFilter]);

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

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <section className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Addon Library
          </p>
          <h1 className="mb-3 text-5xl font-bold md:text-6xl">All Addons</h1>
          <p className="max-w-2xl text-zinc-400">
            Browse the entire FlightMods library for aircraft, airports,
            liveries, scenery, and utilities for MSFS 2020, MSFS 2024, and X-Plane.
          </p>
        </section>

        {/* Filter Bar */}
        <section className="mb-10 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur">
          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              placeholder="Search by title, description, or creator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-zinc-500 focus:border-blue-500"
            />

            <select
              value={simFilter}
              onChange={(e) => setSimFilter(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-black/30 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option>All</option>
              <option>MSFS 2020</option>
              <option>MSFS 2024</option>
              <option>X-Plane</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-black/30 px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option>All</option>
              <option>Aircraft</option>
              <option>Airports</option>
              <option>Liveries</option>
              <option>Scenery</option>
              <option>Utilities</option>
            </select>
          </div>
        </section>

        {/* Result count */}
        {!loading && (
          <div className="mb-6 text-sm text-zinc-400">
            {filteredAddons.length} Addon{filteredAddons.length === 1 ? "" : "s"} found
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <p className="text-zinc-400">Loading addons...</p>
        ) : filteredAddons.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 text-zinc-400 backdrop-blur">
            No matching addons found.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAddons.map((addon) => (
              <div
                key={addon.id}
                className="group rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur transition hover:border-zinc-700 hover:bg-zinc-800/70"
              >
                {addon.image_url ? (
                  <img
                    src={addon.image_url}
                    alt={addon.title}
                    className="mb-4 h-48 w-full rounded-2xl object-cover transition group-hover:scale-[1.01]"
                  />
                ) : (
                  <div className="mb-4 h-48 w-full rounded-2xl bg-zinc-900" />
                )}

                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300">
                    {addon.sim}
                  </span>

                  <span className="rounded-full border border-zinc-600 bg-zinc-800/70 px-3 py-1 text-xs font-medium text-zinc-200">
                    {addon.category}
                  </span>

                  <span className="rounded-full border border-zinc-600 bg-zinc-800/70 px-3 py-1 text-xs font-medium text-zinc-200">
                    v{addon.version}
                  </span>
                </div>

                <Link href={`/addons/${addon.id}`}>
                  <h2 className="mb-2 text-2xl font-semibold group-hover:text-blue-400">
                    {addon.title}
                  </h2>
                </Link>

                <p className="mb-2 text-sm text-zinc-500">
                  from{" "}
                  <Link
                    href={`/creator/${addon.author_name ?? addon.author}`}
                    className="text-zinc-400 hover:text-white"
                  >
                    {addon.author_name ?? addon.author ?? "Unbekannt"}
                  </Link>
                </p>

                <p className="mb-4 text-sm leading-7 text-zinc-400">
                  {addon.description.length > 135
                    ? addon.description
                        .substring(0, 135)
                        .split(" ")
                        .slice(0, -1)
                        .join(" ") + "..."
                    : addon.description}
                </p>

                <div className="mb-4 text-sm text-zinc-500">
                  {addon.downloads} Downloads
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/addons/${addon.id}`}
                    className="rounded-xl bg-zinc-800 px-4 py-2 transition hover:bg-zinc-700"
                  >
                    Details
                  </Link>

                  <DownloadButton addonId={addon.id} fileUrl={addon.file_url} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}