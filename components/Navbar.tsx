"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type UserLike = {
  email?: string;
};

export default function Navbar() {
  const [user, setUser] = useState<UserLike | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
  try {
    await Promise.race([
      supabase.auth.signOut(),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ]);
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    window.location.replace("/");
  }
};

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/10 via-cyan-400/5 to-indigo-500/10" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-2 shadow-lg shadow-blue-500/10">
            <Image
              src="/logo.png"
              alt="FlightMods"
              width={140}
              height={44}
              priority
              className="h-auto w-[120px] object-contain md:w-[140px]"
            />
          </div>
        </Link>

        <div className="flex items-center gap-3 text-sm md:gap-6">
          <Link
            href="/addons"
            className="rounded-xl px-3 py-2 text-zinc-200 transition hover:bg-white/5 hover:text-blue-300"
          >
            Addons
          </Link>

          <Link
            href="/upload"
            className="rounded-xl px-3 py-2 text-zinc-200 transition hover:bg-white/5 hover:text-blue-300"
          >
            Upload
          </Link>

          {loading ? null : user ? (
            <>
              <Link
                href="/profile"
                className="rounded-xl px-3 py-2 text-zinc-200 transition hover:bg-white/5 hover:text-blue-300"
              >
                Profile
              </Link>

              <span className="hidden text-zinc-400 lg:inline">
                {user.email}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white transition hover:bg-zinc-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-3 py-2 text-zinc-200 transition hover:bg-white/5 hover:text-blue-300"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl border border-blue-400/20 bg-blue-600/90 px-4 py-2 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}