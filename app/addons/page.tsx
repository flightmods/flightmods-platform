import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Addon = {
  id: string;
  title: string;
  description: string;
  author: string;
  file_url: string;
  version: string;
  downloads: number;
  created_at: string;
  sim: string;
  category: string;
};

export default async function AddonsPage() {
  const { data: addons, error } = await supabase
    .from("addons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Addons</h1>
        <p className="text-red-400">Fehler beim Laden der Addons: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Addons</h1>

      {!addons || addons.length === 0 ? (
        <p className="text-zinc-400">Noch keine Addons vorhanden.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {addons.map((addon: Addon) => (
            <div
              key={addon.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
            >
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
                <p>Autor: {addon.author}</p>
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

                <a
                  href={addon.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}