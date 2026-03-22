"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "christoph_adam@outlook.de";

type Addon = {
  id: string;
  title: string;
  description: string;
  author: string;
  author_name?: string;
  created_at: string;
  status: string;
  sim?: string;
  category?: string;
  version?: string;
  image_url?: string | null;
};

export default function AdminPage() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user || data.user.email !== ADMIN_EMAIL) {
      window.location.href = "/";
      return;
    }

    fetchPendingAddons();
  }

  async function fetchPendingAddons() {
    setLoading(true);

    const { data, error } = await supabase
      .from("addons")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load pending addons:", error.message);
      setLoading(false);
      return;
    }

    setAddons((data as Addon[]) || []);
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: "approved" | "rejected") {
    const { error } = await supabase
      .from("addons")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert(`Failed to update status: ${error.message}`);
      return;
    }

    setAddons((prev) => prev.filter((addon) => addon.id !== id));
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1120] to-black text-white">
      {/* Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[160px]" />
        <div className="absolute right-[-120px] top-[20%] h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="absolute left-[-120px] bottom-[10%] h-[360px] w-[360px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Content Moderation
          </p>
          <h1 className="mb-3 text-5xl font-bold md:text-6xl">Admin Panel</h1>
          <p className="max-w-2xl text-zinc-400">
            Review pending uploads before they go live on FlightMods.
          </p>
        </div>

        {loading && <p className="text-zinc-400">Loading pending addons...</p>}

        {!loading && addons.length === 0 && (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 text-zinc-400 backdrop-blur">
            No pending addons found.
          </div>
        )}

        <div className="space-y-6">
          {addons.map((addon) => (
            <div
              key={addon.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur"
            >
              <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                <div>
                  {addon.image_url ? (
                    <img
                      src={addon.image_url}
                      alt={addon.title}
                      className="h-40 w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="h-40 w-full rounded-2xl bg-zinc-900" />
                  )}
                </div>

                <div>
                  <h2 className="mb-2 text-2xl font-semibold">{addon.title}</h2>

                  <p className="mb-4 text-zinc-400 leading-7">
                    {addon.description.length > 220
                      ? addon.description
                          .substring(0, 220)
                          .split(" ")
                          .slice(0, -1)
                          .join(" ") + "..."
                      : addon.description}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {addon.sim && (
                      <span className="rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300">
                        {addon.sim}
                      </span>
                    )}

                    {addon.category && (
                      <span className="rounded-full border border-zinc-600 bg-zinc-800/70 px-3 py-1 text-xs font-medium text-zinc-200">
                        {addon.category}
                      </span>
                    )}

                    {addon.version && (
                      <span className="rounded-full border border-zinc-600 bg-zinc-800/70 px-3 py-1 text-xs font-medium text-zinc-200">
                        v{addon.version}
                      </span>
                    )}
                  </div>

                  <div className="mb-5 text-sm text-zinc-500 space-y-1">
                    <p>Author: {addon.author_name ?? addon.author}</p>
                    <p>
                      Uploaded:{" "}
                      {new Date(addon.created_at).toLocaleDateString()}
                    </p>
                    <p>Status: {addon.status}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => updateStatus(addon.id, "approved")}
                      className="rounded-xl bg-green-600 px-4 py-2 font-medium transition hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(addon.id, "rejected")}
                      className="rounded-xl bg-red-600 px-4 py-2 font-medium transition hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}