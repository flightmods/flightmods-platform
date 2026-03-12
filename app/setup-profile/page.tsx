"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SetupProfilePage() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      alert("Bitte einen Benutzernamen eingeben.");
      return;
    }

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (existing) {
      alert("Dieser Benutzername ist bereits vergeben.");
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
      return;
    }

    alert("Profil gespeichert!");
    window.location.href = "/profile";
  };

  if (loading) {
    return (
      <main className="max-w-xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">Profil einrichten</h1>
        <p className="text-zinc-400">Lade Benutzer...</p>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Profil einrichten</h1>

      <p className="text-zinc-400 mb-6">
        Wähle deinen öffentlichen Benutzernamen. Dieser wird später auf deinen
        Addons und deiner Creator-Seite angezeigt.
      </p>

      <input
        className="w-full mb-4 p-3 bg-zinc-800 rounded"
        placeholder="Benutzername"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button
        onClick={handleSave}
        className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700"
      >
        Profil speichern
      </button>
    </main>
  );
}