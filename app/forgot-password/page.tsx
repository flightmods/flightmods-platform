"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResetRequest() {
    if (!email.trim()) {
      alert("Please enter your email address.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    alert("Password reset email sent. Please check your inbox.");
    setLoading(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1120] to-black text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[160px]" />
        <div className="absolute right-[-120px] top-[20%] h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="absolute left-[-120px] bottom-[10%] h-[360px] w-[360px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div
        className="absolute inset-0 -z-10 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Account Recovery
            </p>
            <h1 className="mb-4 text-5xl font-bold md:text-6xl">
              Forgot Password
            </h1>
            <p className="max-w-xl text-zinc-400 leading-8">
              Enter your email address and we will send you a link to reset your password.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur">
            <h2 className="mb-6 text-2xl font-bold">Reset your password</h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">Email</label>
                <input
                  className="w-full rounded-2xl border border-zinc-700 bg-black/30 p-4 outline-none placeholder:text-zinc-500 focus:border-blue-500"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                onClick={handleResetRequest}
                disabled={loading}
                className="w-full rounded-2xl bg-blue-600 px-6 py-4 font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </div>

            <p className="mt-6 text-sm text-zinc-400">
              Back to{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}