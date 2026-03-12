import Link from "next/link";
import { authorToSlug } from "@/lib/creator";
import { supabase } from "@/lib/supabase";
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

export default async function AddonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: addon, error } = await supabase
    .from("addons")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !addon) {
    notFound();
  }

  const typedAddon = addon as Addon;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="text-4xl font-bold mb-4">{typedAddon.title}</h1>

        <div className="text-sm text-zinc-400 mb-6 space-y-1">
          <p>Simulator: {typedAddon.sim}</p>
          <p>Kategorie: {typedAddon.category}</p>
          <p>
  Autor:{" "}
  <Link
    href={`/creator/${authorToSlug(typedAddon.author)}`}
    className="text-blue-400 hover:text-blue-300"
  >
    {typedAddon.author}
  </Link>
</p>
          <p>Version: {typedAddon.version}</p>
          <p>Downloads: {typedAddon.downloads}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Beschreibung</h2>
          <p className="text-zinc-300 whitespace-pre-line">
            {typedAddon.description}
          </p>
        </div>

        <a
          href={typedAddon.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg bg-blue-600 px-5 py-3 hover:bg-blue-700"
        >
          Download Addon
        </a>
      </div>
    </main>
  );
}