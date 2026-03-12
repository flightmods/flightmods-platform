"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import DownloadButton from "@/components/DownloadButton";

type Addon = {
  id: string;
  title: string;
  description: string;
  author: string;
  author_name?: string;
  file_url: string;
  version: string;
  downloads: number;
  created_at: string;
  sim: string;
  category: string;
  image_url?: string;
};

export default function AddonsPage() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [simFilter, setSimFilter] = useState("Alle");
  const [categoryFilter, setCategoryFilter] = useState("Alle");

  useEffect(() => {
    const loadAddons = async () => {
      const { data, error } = await supabase
        .from("addons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fehler beim Laden der Addons:", error.message);
      } else if (data) {
        setAddons(data as Addon[]);
      }

      setLoading(false);
    };

    loadAddons();
  }, []);

  const filteredAddons = useMemo(() => {
    return addons.filter((addon) => {
      const matchesSearch =
        addon.title.toLowerCase().includes(search.toLowerCase()) ||
        addon.description.toLowerCase().includes(search.toLowerCase()) ||
        (addon.author_name ?? addon.author)
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesSim = simFilter === "Alle" || addon.sim === simFilter;
      const matchesCategory =
        categoryFilter === "Alle" || addon.category === categoryFilter;

      return matchesSearch && matchesSim && matchesCategory;
    });
  }, [addons, search, simFilter, categoryFilter]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Addons</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <input
          type="text"
          placeholder="Suche nach Titel, Beschreibung oder Autor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:col-span-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-white"
        />

        <select
          value={simFilter}
          onChange={(e) => setSimFilter(e.target.value)}
          className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-white"
        >
          <option>Alle</option>
          <option>MSFS 2020</option>
          <option>MSFS 2024</option>
          <option>X-Plane</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-white"
        >
          <option>Alle</option>
          <option>Aircraft</option>
          <option>Airports</option>
          <option>Liveries</option>
          <option>Scenery</option>
          <option>Utilities</option>
        </select>
      </div>

      {loading ? (
        <p className="text-zinc-400">Lade Addons...</p>
      ) : filteredAddons.length === 0 ? (
        <p className="text-zinc-400">Keine passenden Addons gefunden.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAddons.map((addon) => (
            <div
              key={addon.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
            >
              {addon.image_url && (
  <img
    src={addon.image_url}
    alt={addon.title}
    className="w-full h-40 object-cover rounded-lg mb-4"
  />
)}
              <Link href={`/addons/${addon.id}`}>
                <h2 className="text-2xl font-semibold mb-2 hover:text-blue-400">
                  {addon.title}
                </h2>
              </Link>

              <p className="text-zinc-400 mb-4 line-clamp-3">
                {addon.description}
              </p>

              <div className="text-sm text-zinc-500 mb-4 space-y-1">
                <p>Simulator: {addon.sim}</p>
                <p>Kategorie: {addon.category}</p>
                <p>
                  Autor:{" "}
                  <Link
                    href={`/creator/${addon.author_name ?? addon.author}`}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {addon.author_name ?? addon.author}
                  </Link>
                </p>
                <p>Version: {addon.version}</p>
                <p>Downloads: {addon.downloads}</p>
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/addons/${addon.id}`}
                  className="inline-block rounded-lg bg-zinc-700 px-4 py-2 hover:bg-zinc-600"
                >
                  Details
                </Link>

                <DownloadButton addonId={addon.id} fileUrl={addon.file_url} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}