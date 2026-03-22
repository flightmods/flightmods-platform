import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-black/30 backdrop-blur-xl">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/5 via-cyan-400/5 to-indigo-500/5" />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 text-sm text-zinc-400 md:flex-row">
        
        {/* Left side */}
        <div>
          <p className="text-base font-semibold text-white">FlightMods</p>
          <p className="text-zinc-500">
            Your platform for Flight Simulator addons
          </p>
        </div>

        {/* Right side */}
        <div className="flex flex-wrap items-center gap-5">
          <a
            href="https://buymeacoffee.com/flightmods"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-yellow-500/90 px-4 py-2 text-black font-medium transition hover:bg-yellow-400"
          >
            Buy Me a Coffee ☕
          </a>

          <Link href="/impressum" className="hover:text-white transition">
            Legal Notice
          </Link>

          <Link href="/datenschutz" className="hover:text-white transition">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}