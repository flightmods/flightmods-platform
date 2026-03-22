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
  author_name?: string;
  file_url: string;
  image_url?: string;
  version: string;
  downloads: number;
  created_at: string;
  sim: string;
  category: string;
};

type Profile = {
  id: string;
  username: string;
  bio?: string;
  avatar_url?: string;
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
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error || !addons) {
    notFound();
  }

  const creatorAddons = (addons as Addon[]).filter(
    (addon) => addon.author_name === slug || authorToSlug(addon.author) === slug
  );

  if (creatorAddons.length === 0) {
    notFound();
  }

  const creatorName = creatorAddons[0].author_name ?? creatorAddons[0].author;

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", creatorName)
    .maybeSingle();

  const profile = profileData as Profile | null;

  const totalDownloads = creatorAddons.reduce(
    (sum, addon) => sum + (addon.downloads ?? 0),
    0
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="shrink-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={creatorName}
                className="w-28 h-28 rounded-full object-cover border border-zinc-700"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-3xl">
                {creatorName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-3">{creatorName}</h1>
            <p className="text-zinc-400">Creator-Profil</p>

            {profile?.bio && (
              <p className="text-zinc-300 mt-4 max-w-2xl">{profile.bio}</p>
            )}

            <div className="mt-4 text-sm text-zinc-500 space-y-1">
              <p>Hochgeladene Addons: {creatorAddons.length}</p>
              <p>Gesamte Downloads: {totalDownloads}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Addons dieses Creators</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {creatorAddons.map((addon) => (
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