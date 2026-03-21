"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SetupProfilePage() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUserId(user.id);
      setEmail(user.email ?? null);
      setLoading(false);
    };

    loadUser();
  }, []);

  const handleSave = async () => {
    if (!userId || !email) return;

    const cleanUsername = username.trim().toLowerCase();

    if (!cleanUsername) {
      alert("Please enter a username.");
      return;
    }

    setSaving(true);

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (existing) {
      alert("This username is already taken.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("profiles").upsert([
      {
        id: userId,
        email,
        username: cleanUsername,
      },
    ]);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    window.location.href = "/profile";
  };

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1120] to-black text-white">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <p className="text-zinc-400">Loading user...</p>
        </div>
      </main>
    );
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

      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-2">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Public Identity
            </p>
            <h1 className="mb-4 text-5xl font-bold md:text-6xl">
              Profil einrichten
            </h1>
            <p className="max-w-xl text-zinc-400 leading-8">
              Choose your public username. This will be displayed on your addons,
              profile, and creator page.
            </p>
          </div>

          {/* Right */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur">
            <h2 className="mb-6 text-2xl font-bold">Choose Username</h2>

            <label className="mb-2 block text-sm text-zinc-400">
              Public Username
            </label>

            <input
              className="mb-6 w-full rounded-2xl border border-zinc-700 bg-black/30 p-4 outline-none placeholder:text-zinc-500 focus:border-blue-500"
              placeholder="e.g., christophmods"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-2xl bg-blue-600 px-6 py-4 font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Save..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}