"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "christoph_adam@outlook.de";

type Addon = {
  id: string;
  title: string;
  description: string;
  author: string;
  author_name?: string;
  file_url: string;
  image_url?: string | null;
  version: string;
  downloads: number;
  created_at: string;
  sim: string;
  category: string;
  status: string;
};

export default function AdminAddonPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [addon, setAddon] = useState<Addon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAndLoadAddon();
  }, []);

  async function checkAdminAndLoadAddon() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user || data.user.email !== ADMIN_EMAIL) {
      window.location.href = "/";
      return;
    }

    const { data: addonData, error: addonError } = await supabase
      .from("addons")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (addonError) {
      console.error("Failed to load addon:", addonError.message);
      setLoading(false);
      return;
    }

    if (!addonData) {
      setLoading(false);
      return;
    }

    setAddon(addonData as Addon);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1120] to-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="text-zinc-400">Loading addon preview...</p>
        </div>
      </main>
    );
  }

  if (!addon) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1120] to-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur">
            <h1 className="mb-4 text-3xl font-bold">Addon not found</h1>
            <p className="mb-6 text-zinc-400">
              This addon could not be loaded.
            </p>
            <Link
              href="/admin"
              className="rounded-xl bg-zinc-800 px-4 py-3 text-sm font-medium transition hover:bg-zinc-700"
            >
              Back to Admin
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const creatorName = addon.author_name ?? addon.author;

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

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Admin Preview
            </p>
            <h1 className="text-4xl font-bold md:text-5xl">{addon.title}</h1>
          </div>

          <Link
            href="/admin"
            className="rounded-xl bg-zinc-800 px-4 py-3 text-sm font-medium transition hover:bg-zinc-700"
          >
            Back to Admin
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur">
              {addon.image_url ? (
                <img
                  src={addon.image_url}
                  alt={addon.title}
                  className="h-[360px] w-full object-cover"
                />
              ) : (
                <div className="h-[360px] w-full bg-zinc-900" />
              )}
            </section>

            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
              <h2 className="mb-4 text-2xl font-bold">Description</h2>
              <div className="whitespace-pre-line leading-8 text-zinc-300">
                {addon.description}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
              <h2 className="mb-5 text-2xl font-bold">Addon Info</h2>

              <div className="space-y-3 text-sm text-zinc-300">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Creator</span>
                  <span>{creatorName}</span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Simulator</span>
                  <span>{addon.sim}</span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Category</span>
                  <span>{addon.category}</span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Version</span>
                  <span>{addon.version}</span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Status</span>
                  <span>{addon.status}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Uploaded</span>
                  <span>{new Date(addon.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
              <h2 className="mb-4 text-xl font-bold">File</h2>

              <a
                href={addon.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-medium transition hover:bg-blue-700"
              >
                Download Uploaded File
              </a>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}