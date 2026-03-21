import Link from "next/link";

export default function ComingSoonPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1120] to-black text-white">
      {/* Hintergrund-Lichter */}
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

      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="grid w-full items-center gap-12 md:grid-cols-2">
          {/* Links */}
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
              FlightMods.de
            </p>

            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
              Something new is on the horizon.
            </h1>

            <p className="mb-4 max-w-xl text-lg text-zinc-300">
              FlightMods.de is currently under construction. In the background,
              a modern platform for Flight Simulator addons is being developed.
            </p>

            <p className="mb-8 max-w-xl text-zinc-400">
              Creator profiles, uploads, screenshots, downloads, and much more
              are currently being developed step by step.
            </p>

            <div className="flex flex-wrap gap-4">
              <span className="rounded-xl border border-zinc-700 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-300 backdrop-blur">
                MSFS 2020
              </span>
              <span className="rounded-xl border border-zinc-700 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-300 backdrop-blur">
                MSFS 2024
              </span>
              <span className="rounded-xl border border-zinc-700 bg-zinc-900/60 px-4 py-2 text-sm text-zinc-300 backdrop-blur">
                X-Plane
              </span>
            </div>
          </div>

          {/* Rechts */}
          <div className="relative">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-2xl backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Status</p>
                  <p className="text-xl font-semibold text-white">
                    Under Construction
                  </p>
                </div>

                <div className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
                  Beta Setup
                </div>
              </div>

              <div className="mb-6 overflow-hidden rounded-2xl border border-zinc-800">
                <img
                  src="/logo.png"
                  alt="FlightMods Logo"
                  className="h-56 w-full object-contain bg-[#050b18] p-6"
                />
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
                  <p className="text-sm text-zinc-400">Planned Features</p>
                  <p className="mt-1 text-white">
                    Addon Uploads, Creator Pages, Screenshots, Categories,
                    Trending & Latest
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
                  <p className="text-sm text-zinc-400">Technical Stack</p>
                  <p className="mt-1 text-white">Next.js, Supabase, Vercel</p>
                </div>
              </div>

              <div className="mt-6 text-sm text-zinc-500">
                Public launch will follow after completion of core features.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}