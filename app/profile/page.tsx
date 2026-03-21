"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type UserLike = {
  id: string;
  email?: string;
};

type Profile = {
  id: string;
  email: string;
  username: string;
  bio?: string;
  avatar_url?: string;
};

type Addon = {
  id: string;
  title: string;
  description: string;
  sim: string;
  category: string;
  version: string;
  downloads: number;
  image_url?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserLike | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);

  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;

      if (!currentUser) {
        setLoading(false);
        return;
      }

      setUser({
        id: currentUser.id,
        email: currentUser.email ?? "",
      });

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (!profileData) {
        window.location.href = "/setup-profile";
        return;
      }

      const typedProfile = profileData as Profile;
      setProfile(typedProfile);
      setBio(typedProfile.bio ?? "");

      const { data: addonData, error } = await supabase
        .from("addons")
        .select("*")
        .eq("author_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (!error && addonData) {
        setAddons(addonData as Addon[]);
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    setSaving(true);

    let avatarUrl = profile.avatar_url ?? null;

    if (avatar) {
      const avatarName = `${user.id}_${Date.now()}_${avatar.name.replace(/\s+/g, "_")}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(avatarName, avatar);

      if (uploadError) {
        alert(`Avatar-Upload fehlgeschlagen: ${uploadError.message}`);
        setSaving(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(avatarName);

      avatarUrl = publicUrl;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        bio,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    setProfile({
      ...profile,
      bio,
      avatar_url: avatarUrl ?? undefined,
    });

    alert("Profil aktualisiert.");
    setSaving(false);
  };

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1120] to-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="text-zinc-400">Lade Profil...</p>
        </div>
      </main>
    );
  }

  if (!user || !profile) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1120] to-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur">
            <h1 className="mb-4 text-4xl font-bold">Profil</h1>
            <p className="text-red-400">Du bist nicht eingeloggt.</p>
          </div>
        </div>
      </main>
    );
  }

  const totalDownloads = addons.reduce(
    (sum, addon) => sum + (addon.downloads ?? 0),
    0
  );

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
            Creator Profile
          </p>
          <h1 className="mb-3 text-5xl font-bold md:text-6xl">Mein Profil</h1>
          <p className="max-w-2xl text-zinc-400">
            Verwalte deinen öffentlichen Creator-Auftritt, passe Bio und Avatar an
            und behalte deine Addons im Blick.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left */}
          <div className="space-y-8">
            {/* Main Profile Card */}
            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="shrink-0">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.username}
                      className="h-28 w-28 rounded-full border border-zinc-700 object-cover"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-3xl font-bold">
                      {profile.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="mb-1 text-sm text-zinc-400">Öffentlicher Benutzername</p>
                  <h2 className="text-3xl font-bold">{profile.username}</h2>

                  <p className="mt-3 text-sm text-zinc-400">Eingeloggt als</p>
                  <p className="text-zinc-200">{user.email}</p>

                  {profile.bio ? (
                    <p className="mt-4 max-w-2xl leading-7 text-zinc-300">
                      {profile.bio}
                    </p>
                  ) : (
                    <p className="mt-4 text-zinc-500">
                      Noch keine Bio hinterlegt.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Edit Profile */}
            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
              <h2 className="mb-5 text-2xl font-bold">Profil bearbeiten</h2>

              <label className="mb-2 block text-sm text-zinc-400">Bio</label>
              <textarea
                className="mb-5 min-h-[140px] w-full rounded-2xl border border-zinc-700 bg-black/30 p-4 text-white outline-none placeholder:text-zinc-500 focus:border-blue-500"
                placeholder="Erzähl etwas über dich als Creator..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />

              <label className="mb-2 block text-sm text-zinc-400">Avatar</label>
              <input
                type="file"
                accept="image/*"
                className="mb-6 block w-full rounded-xl border border-zinc-700 bg-black/20 p-3 text-sm text-zinc-300"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              />

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="rounded-xl bg-blue-600 px-6 py-3 font-medium shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Speichere..." : "Profil speichern"}
              </button>
            </section>

            {/* My Addons */}
            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Meine Addons</h2>
                <Link
                  href={`/creator/${profile.username}`}
                  className="rounded-xl bg-zinc-800 px-4 py-2 text-sm transition hover:bg-zinc-700"
                >
                  Öffentliche Creator-Seite
                </Link>
              </div>

              {addons.length === 0 ? (
                <p className="text-zinc-400">Du hast noch keine Addons hochgeladen.</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {addons.map((addon) => (
                    <div
                      key={addon.id}
                      className="rounded-2xl border border-zinc-800 bg-black/20 p-4 transition hover:bg-zinc-800/40"
                    >
                      {addon.image_url && (
                        <img
                          src={addon.image_url}
                          alt={addon.title}
                          className="mb-4 h-40 w-full rounded-xl object-cover"
                        />
                      )}

                      <Link href={`/addons/${addon.id}`}>
                        <h3 className="mb-2 text-xl font-semibold hover:text-blue-400">
                          {addon.title}
                        </h3>
                      </Link>

                      <p className="mb-4 text-sm leading-7 text-zinc-400">
                        {addon.description.length > 110
                          ? addon.description
                              .substring(0, 110)
                              .split(" ")
                              .slice(0, -1)
                              .join(" ") + "..."
                          : addon.description}
                      </p>

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

                      <p className="text-sm text-zinc-500">
                        {addon.downloads} Downloads
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
              <h2 className="mb-5 text-2xl font-bold">Statistiken</h2>

              <div className="space-y-3 text-sm text-zinc-300">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Addons</span>
                  <span>{addons.length}</span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Gesamtdownloads</span>
                  <span>{totalDownloads}</span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Username</span>
                  <span>{profile.username}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
              <h2 className="mb-4 text-xl font-bold">Schnellzugriff</h2>

              <div className="flex flex-col gap-3">
                <Link
                  href="/upload"
                  className="rounded-xl bg-blue-600 px-4 py-3 text-center font-medium shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Neues Addon hochladen
                </Link>

                <Link
                  href={`/creator/${profile.username}`}
                  className="rounded-xl bg-zinc-800 px-4 py-3 text-center font-medium transition hover:bg-zinc-700"
                >
                  Öffentliche Creator-Seite
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}