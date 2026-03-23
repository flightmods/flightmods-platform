"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type UserLike = {
  id: string;
  email?: string;
};

type Addon = {
  id: string;
  title: string;
  description: string;
  sim: string;
  category: string;
  version: string;
  file_url: string;
  image_url?: string | null;
  author_id: string;
};

export default function EditAddonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [user, setUser] = useState<UserLike | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sim, setSim] = useState("MSFS 2020");
  const [category, setCategory] = useState("Aircraft");
  const [version, setVersion] = useState("1.0");

  const [currentFileUrl, setCurrentFileUrl] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const [newFile, setNewFile] = useState<File | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadAddon();
  }, [id]);

  async function loadAddon() {
    setLoading(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      window.location.href = "/login";
      return;
    }

    const currentUser = userData.user;
    setUser(currentUser);

    const { data: addonData, error: addonError } = await supabase
      .from("addons")
      .select("*")
      .eq("id", id)
      .eq("author_id", currentUser.id)
      .maybeSingle();

    if (addonError || !addonData) {
      window.location.href = "/profile";
      return;
    }

    const addon = addonData as Addon;

    setTitle(addon.title);
    setDescription(addon.description);
    setSim(addon.sim);
    setCategory(addon.category);
    setVersion(addon.version);
    setCurrentFileUrl(addon.file_url);
    setCurrentImageUrl(addon.image_url ?? null);
    setImagePreview(addon.image_url ?? null);

    setLoading(false);
  }

  async function handleSave() {
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    if (!title.trim()) {
      alert("Please enter an addon title.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a description.");
      return;
    }

    setSaving(true);

    try {
      let fileUrl = currentFileUrl;
      let imageUrl = currentImageUrl;

      // Replace addon file if a new one was selected
      if (newFile) {
        const safeFileName = `${Date.now()}_${newFile.name.replace(/\s+/g, "_")}`;

        const { error: fileUploadError } = await supabase.storage
          .from("addons")
          .upload(safeFileName, newFile);

        if (fileUploadError) {
          alert(`Addon file upload failed: ${fileUploadError.message}`);
          setSaving(false);
          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("addons").getPublicUrl(safeFileName);

        fileUrl = publicUrl;
      }

      // Replace cover image if a new one was selected
      if (newImage) {
        const safeImageName = `${Date.now()}_${newImage.name.replace(/\s+/g, "_")}`;

        const { error: imageUploadError } = await supabase.storage
          .from("addon-images")
          .upload(safeImageName, newImage);

        if (imageUploadError) {
          alert(`Cover image upload failed: ${imageUploadError.message}`);
          setSaving(false);
          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("addon-images").getPublicUrl(safeImageName);

        imageUrl = publicUrl;
      }

      const { error: updateError } = await supabase
        .from("addons")
        .update({
          title: title.trim(),
          description: description.trim(),
          sim,
          category,
          version: version.trim() || "1.0",
          file_url: fileUrl,
          image_url: imageUrl,
          status: "pending",
        })
        .eq("id", id)
        .eq("author_id", user.id);

      if (updateError) {
        alert(`Failed to update addon: ${updateError.message}`);
        setSaving(false);
        return;
      }

      alert("Addon updated successfully and sent back for review.");
      window.location.href = "/profile";
    } catch (error) {
      console.error("Unexpected update error:", error);
      alert("An unexpected error occurred while updating the addon.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1120] to-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="text-zinc-400">Loading addon...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1120] to-black text-white">
      {/* Glow */}
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

      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-blue-300">
            Creator Update
          </p>
          <h1 className="mb-3 text-5xl font-bold">Edit Addon</h1>
          <p className="text-zinc-400">
            Update your addon details. Edited addons will be reviewed again before going live.
          </p>
        </div>

        <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">Addon Title</label>
            <input
              className="w-full rounded-2xl border border-zinc-700 bg-black/30 p-4 outline-none placeholder:text-zinc-500 focus:border-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter addon title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">Description</label>
            <textarea
              className="min-h-[160px] w-full rounded-2xl border border-zinc-700 bg-black/30 p-4 outline-none placeholder:text-zinc-500 focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your addon"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">Simulator</label>
              <select
                className="w-full rounded-2xl border border-zinc-700 bg-black/30 p-4 outline-none focus:border-blue-500"
                value={sim}
                onChange={(e) => setSim(e.target.value)}
              >
                <option>MSFS 2020</option>
                <option>MSFS 2024</option>
                <option>X-Plane</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">Category</label>
              <select
                className="w-full rounded-2xl border border-zinc-700 bg-black/30 p-4 outline-none focus:border-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Aircraft</option>
                <option>Airports</option>
                <option>Liveries</option>
                <option>Scenery</option>
                <option>Utilities</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">Version</label>
              <input
                className="w-full rounded-2xl border border-zinc-700 bg-black/30 p-4 outline-none placeholder:text-zinc-500 focus:border-blue-500"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Replace Addon File (optional)
            </label>
            <input
              type="file"
              className="block w-full rounded-xl border border-zinc-700 bg-black/20 p-3 text-sm text-zinc-300"
              onChange={(e) => setNewFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Replace Cover Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              className="block w-full rounded-xl border border-zinc-700 bg-black/20 p-3 text-sm text-zinc-300"
              onChange={(e) => {
                const selectedImage = e.target.files?.[0] || null;
                setNewImage(selectedImage);

                if (selectedImage) {
                  setImagePreview(URL.createObjectURL(selectedImage));
                }
              }}
            />

            {imagePreview && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-zinc-400">Current / New Preview</p>
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="max-h-64 w-full rounded-2xl border border-zinc-800 object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-2xl bg-blue-600 px-6 py-4 font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() => (window.location.href = "/profile")}
              className="rounded-2xl bg-zinc-800 px-6 py-4 font-semibold transition hover:bg-zinc-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}