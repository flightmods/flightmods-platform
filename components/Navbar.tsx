"use client";

import Link from "next/link";
import Image from "next/image";
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
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="FlightMods"
            width={170}
            height={52}
            priority
            className="h-auto w-[170px] object-contain"
          />
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/addons" className="hover:text-blue-400 transition">
            Addons
          </Link>

          <Link href="/upload" className="hover:text-blue-400 transition">
            Upload
          </Link>

          {loading ? null : user ? (
            <>
              <Link href="/profile" className="hover:text-blue-400 transition">
                Profil
              </Link>

              <span className="hidden text-zinc-400 md:inline">
                {user.email}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-zinc-800 px-4 py-2 transition hover:bg-zinc-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-400 transition">
                Login
              </Link>

              <Link href="/register" className="hover:text-blue-400 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}