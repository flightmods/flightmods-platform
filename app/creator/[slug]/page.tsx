import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { authorToSlug } from "@/lib/creator";
import DownloadButton from "@/components/DownloadButton";
import { notFound } from "next/navigation";

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

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: addons, error } = await supabase
    .from("addons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !addons) {
    notFound();
  }

  const creatorAddons = (addons as Addon[]).filter(
    (addon) => authorToSlug(addon.author) === slug
  );

  if (creatorAddons.length === 0) {
    notFound();
  }

  const creatorName = creatorAddons[0].author;
  const totalDownloads = creatorAddons.reduce(
    (sum, addon) => sum + (addon.downloads ?? 0),
    0
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-4xl font-bold mb-3">{creatorName}</h1>
        <p className="text-zinc-400">Creator-Profil</p>

        <div className="mt-4 text-sm text-zinc-500 space-y-1">
          <p>Hochgeladene Addons: {creatorAddons.length}</p>
          <p>Gesamte Downloads: {totalDownloads}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Addons dieses Creators</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {creatorAddons.map((addon) => (
          <div
            key={addon.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
          >
            <Link href={`/addons/${addon.id}`}>
              <h3 className="text-2xl font-semibold mb-2 hover:text-blue-400">
                {addon.title}
              </h3>
            </Link>

            <p className="text-zinc-400 mb-4 line-clamp-3">
              {addon.description}
            </p>

            <div className="text-sm text-zinc-500 mb-4 space-y-1">
              <p>Simulator: {addon.sim}</p>
              <p>Kategorie: {addon.category}</p>
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
    </main>
  );
}