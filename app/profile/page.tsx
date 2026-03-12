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

      setProfile(profileData as Profile);

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

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Profil</h1>
        <p className="text-zinc-400">Lade Profil...</p>
      </main>
    );
  }

  if (!user) {
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
        <p className="text-zinc-400 mb-2">Eingeloggt als</p>
        <p className="text-xl font-semibold">{user.email}</p>

        <p className="text-zinc-400 mt-4 mb-1">Öffentlicher Benutzername</p>
        <p className="text-lg font-semibold">{profile?.username}</p>

        <p className="text-zinc-500 mt-3">Hochgeladene Addons: {addons.length}</p>

        {profile?.username && (
          <Link
            href={`/creator/${profile.username}`}
            className="inline-block mt-4 rounded bg-zinc-700 px-4 py-2 hover:bg-zinc-600"
          >
            Meine Creator-Seite
          </Link>
        )}
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