"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type UserLike = {
  email?: string;
};

export default function Navbar() {
  const [user, setUser] = useState<UserLike | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-zinc-900 border-b border-zinc-800">
      <div className="font-bold text-lg">
        <Link href="/">FlightMods</Link>
      </div>

      <div className="flex gap-6 text-sm items-center">
        <Link href="/addons">Addons</Link>
        <Link href="/upload">Upload</Link>

        {loading ? null : user ? (
          <>
            <Link href="/profile">Profil</Link>
            <span className="text-zinc-400 hidden md:inline">{user.email}</span>
            <button
              onClick={handleLogout}
              className="rounded bg-zinc-700 px-3 py-1 hover:bg-zinc-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}