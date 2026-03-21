"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Addon = {
  id: string;
  title: string;
  description: string;
  image_url?: string | null;
  downloads: number;
};

export default function Home() {
  const [featured, setFeatured] = useState<Addon | null>(null);
  const [latest, setLatest] = useState<Addon[]>([]);
  const [popular, setPopular] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: featuredRows, error: featuredError } = await supabase
          .from("addons")
          .select("*")
          .order("downloads", { ascending: false })
          .limit(1);

        const { data: latestData, error: latestError } = await supabase
          .from("addons")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6);

        const { data: popularData, error: popularError } = await supabase
          .from("addons")
          .select("*")
          .order("downloads", { ascending: false })
          .limit(6);

        if (featuredError) console.error("Featured error:", featuredError.message);
        if (latestError) console.error("Latest error:", latestError.message);
        if (popularError) console.error("Popular error:", popularError.message);

        setFeatured(featuredRows?.[0] ?? null);
        setLatest((latestData as Addon[]) || []);
        setPopular((popularData as Addon[]) || []);
      } catch (error) {
        console.error("Homepage fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      {featured && (
        <section className="mb-16">
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
            {featured.image_url && (
              <img
                src={featured.image_url}
                alt={featured.title}
                className="w-full h-[300px] object-cover opacity-60"
              />
            )}

            <div className="absolute inset-0 flex flex-col justify-center p-8">
              <h2 className="text-3xl font-bold mb-2">⭐ Featured Addon</h2>
              <h3 className="text-2xl mb-2">{featured.title}</h3>
              <p className="text-zinc-300 mb-4 max-w-xl line-clamp-3">
                {featured.description}
              </p>
              <Link
                href={`/addons/${featured.id}`}
                className="bg-blue-600 px-6 py-3 rounded-lg w-fit hover:bg-blue-700"
              >
                Jetzt ansehen
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">FlightMods</h1>
        <p className="text-zinc-400 mb-6">
          Deine Plattform für Flight Simulator Addons
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/addons"
            className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Addons entdecken
          </Link>

          <Link
            href="/upload"
            className="bg-zinc-700 px-6 py-3 rounded-lg hover:bg-zinc-600"
          >
            Addon hochladen
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Neueste Addons</h2>

        {loading ? (
          <p className="text-zinc-400">Lade Inhalte...</p>
        ) : latest.length === 0 ? (
          <p className="text-zinc-500">Noch keine Addons vorhanden.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {latest.map((addon) => (
              <Link
                key={addon.id}
                href={`/addons/${addon.id}`}
                className="border border-zinc-800 rounded-xl p-4 hover:bg-zinc-900"
              >
                {addon.image_url && (
                  <img
                    src={addon.image_url}
                    alt={addon.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}

                <h3 className="text-lg font-semibold">{addon.title}</h3>
                <p className="text-sm text-zinc-400 line-clamp-2">
                  {addon.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Beliebte Addons</h2>

        {loading ? (
          <p className="text-zinc-400">Lade Inhalte...</p>
        ) : popular.length === 0 ? (
          <p className="text-zinc-500">Noch keine beliebten Addons vorhanden.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {popular.map((addon) => (
              <Link
                key={addon.id}
                href={`/addons/${addon.id}`}
                className="border border-zinc-800 rounded-xl p-4 hover:bg-zinc-900"
              >
                {addon.image_url && (
                  <img
                    src={addon.image_url}
                    alt={addon.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}

                <h3 className="text-lg font-semibold">{addon.title}</h3>
                <p className="text-sm text-zinc-400 line-clamp-2">
                  {addon.description}
                </p>
                <p className="text-xs text-zinc-500 mt-2">
                  {addon.downloads} Downloads
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}