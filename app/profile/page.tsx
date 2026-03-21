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
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Profil</h1>
        <p className="text-zinc-400">Lade Profil...</p>
      </main>
    );
  }

  if (!user || !profile) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Profil</h1>
        <p className="text-red-400">Du bist nicht eingeloggt.</p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">Profil</h1>

      <div className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="shrink-0">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-28 h-28 rounded-full object-cover border border-zinc-700"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-3xl">
                {profile.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1">
            <p className="text-zinc-400 mb-2">Eingeloggt als</p>
            <p className="text-xl font-semibold">{user.email}</p>

            <p className="text-zinc-400 mt-4 mb-1">Öffentlicher Benutzername</p>
            <p className="text-lg font-semibold">{profile.username}</p>

            <p className="text-zinc-500 mt-3">Hochgeladene Addons: {addons.length}</p>

            <Link
              href={`/creator/${profile.username}`}
              className="inline-block mt-4 rounded bg-zinc-700 px-4 py-2 hover:bg-zinc-600"
            >
              Meine Creator-Seite
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-2xl font-bold mb-4">Profil bearbeiten</h2>

        <textarea
          className="w-full mb-4 p-3 bg-zinc-800 rounded min-h-[120px]"
          placeholder="Kurze Bio über dich als Creator"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          className="mb-4 block w-full"
          onChange={(e) => setAvatar(e.target.files?.[0] || null)}
        />

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Speichere..." : "Profil speichern"}
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6">Meine Addons</h2>

      {addons.length === 0 ? (
        <p className="text-zinc-400">Du hast noch keine Addons hochgeladen.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {addons.map((addon) => (
            <div
              key={addon.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <Link href={`/addons/${addon.id}`}>
                <h3 className="text-xl font-semibold mb-2 hover:text-blue-400">
                  {addon.title}
                </h3>
              </Link>

              <p className="text-zinc-400 mb-4 line-clamp-3">
                {addon.description}
              </p>

              <div className="text-sm text-zinc-500 space-y-1">
                <p>Simulator: {addon.sim}</p>
                <p>Kategorie: {addon.category}</p>
                <p>Version: {addon.version}</p>
                <p>Downloads: {addon.downloads}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}