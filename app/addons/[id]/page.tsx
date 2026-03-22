import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DownloadButton from "@/components/DownloadButton";

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
  username: string;
  bio?: string;
  avatar_url?: string;
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
  const creatorName = typedAddon.author_name ?? typedAddon.author;

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", creatorName)
    .maybeSingle();

  const profile = profileData as Profile | null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1120] to-black text-white">
      {/* Glow Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[160px]" />
        <div className="absolute right-[-120px] top-[20%] h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="absolute left-[-120px] bottom-[10%] h-[360px] w-[360px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Hero */}
        <section className="mb-10">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur">
            {typedAddon.image_url ? (
              <img
                src={typedAddon.image_url}
                alt={typedAddon.title}
                className="h-[360px] w-full object-cover"
              />
            ) : (
              <div className="h-[360px] w-full bg-zinc-900" />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-300">
                  {typedAddon.sim}
                </span>
                <span className="rounded-full border border-zinc-600 bg-zinc-800/70 px-3 py-1 text-xs font-medium text-zinc-200">
                  {typedAddon.category}
                </span>
                <span className="rounded-full border border-zinc-600 bg-zinc-800/70 px-3 py-1 text-xs font-medium text-zinc-200">
                  v{typedAddon.version}
                </span>
              </div>

              <h1 className="mb-3 max-w-4xl text-4xl font-bold md:text-6xl">
                {typedAddon.title}
              </h1>

              <p className="max-w-3xl text-zinc-200 text-base md:text-lg leading-7">
                {typedAddon.description.length > 220
                  ? typedAddon.description
                      .substring(0, 220)
                      .split(" ")
                      .slice(0, -1)
                      .join(" ") + "..."
                  : typedAddon.description}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Left */}
          <div className="space-y-8">
            {/* Description */}
            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
              <h2 className="mb-4 text-2xl font-bold">Description</h2>
              <div className="text-zinc-300 leading-8 whitespace-pre-line">
                {typedAddon.description}
              </div>
            </section>

            {/* Creator */}
            <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
              <h2 className="mb-4 text-2xl font-bold">Creator</h2>

              <Link
                href={`/creator/${creatorName}`}
                className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-black/20 p-4 transition hover:bg-zinc-800/50"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={creatorName}
                    className="h-16 w-16 rounded-full object-cover border border-zinc-700"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-2xl font-bold">
                    {creatorName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="text-lg font-semibold">{creatorName}</p>
                  <p className="text-sm text-zinc-400">
                    Go to Creator Page
                  </p>
                </div>
              </Link>

              {profile?.bio && (
                <p className="mt-4 text-zinc-300 leading-7">{profile.bio}</p>
              )}
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* Download Card */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
              <h2 className="mb-5 text-2xl font-bold">Download</h2>

              <div className="mb-5 space-y-3 text-sm text-zinc-300">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Simulator</span>
                  <span>{typedAddon.sim}</span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Category</span>
                  <span>{typedAddon.category}</span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Version</span>
                  <span>{typedAddon.version}</span>
                </div>

                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Downloads</span>
                  <span>{typedAddon.downloads}</span>
                </div>
              </div>

              <div className="w-full">
                <DownloadButton
                  addonId={typedAddon.id}
                  fileUrl={typedAddon.file_url}
                />
              </div>
            </div>

            {/* Meta */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
              <h2 className="mb-4 text-xl font-bold">Info</h2>

              <p className="text-sm text-zinc-400">
                Uploaded by{" "}
                <Link
                  href={`/creator/${creatorName}`}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {creatorName}
                </Link>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}