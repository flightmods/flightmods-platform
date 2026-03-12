"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type UserLike = {
  email?: string;
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
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user ?? null;
      setUser(currentUser);

      if (currentUser?.email) {
        const { data: addonData, error } = await supabase
          .from("addons")
          .select("*")
          .eq("author", currentUser.email)
          .order("created_at", { ascending: false });

        if (!error && addonData) {
          setAddons(addonData as Addon[]);
        }
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
        <p className="text-zinc-500 mt-3">
          Hochgeladene Addons: {addons.length}
        </p>
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