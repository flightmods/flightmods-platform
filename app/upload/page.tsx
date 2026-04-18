"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type UserLike = {
  id: string;
  email?: string;
};

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sim, setSim] = useState("MSFS 2020");
  const [category, setCategory] = useState("Aircraft");
  const [version, setVersion] = useState("1.0");

  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [user, setUser] = useState<UserLike | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Failed to load user:", error.message);
        setUser(null);
      } else {
        setUser(data.user ?? null);
      }

      setLoadingUser(false);
    };

    loadUser();
  }, []);

  const handleUpload = async () => {
    console.log("1 - upload started");

    if (!user) {
      alert("You must be logged in to upload an addon.");
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

    if (!file) {
      alert("Please select an addon file.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("sim", sim);
      formData.append("category", category);
      formData.append("version", version.trim() || "1.0");
      formData.append("userId", user.id);
      formData.append("userEmail", user.email || "");
      formData.append("file", file);

      if (image) {
        formData.append("image", image);
      }

      console.log("2 - sending upload request to /api/upload");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("3 - upload response", data);

      if (!res.ok) {
        alert(data.error || "Upload failed.");
        return;
      }

      alert(
        data.message || "Addon uploaded successfully and is now pending review."
      );

      setTitle("");
      setDescription("");
      setSim("MSFS 2020");
      setCategory("Aircraft");
      setVersion("1.0");
      setFile(null);
      setImage(null);
      setImagePreview(null);

      const fileInput = document.getElementById(
        "addon-file-input"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      const imageInput = document.getElementById(
        "addon-image-input"
      ) as HTMLInputElement | null;

      if (imageInput) {
        imageInput.value = "";
      }

      console.log("4 - upload finished successfully");
    } catch (error) {
      console.error("UPLOAD PAGE ERROR:", error);
      alert("An unexpected error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  if (loadingUser) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1120] to-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="text-zinc-400">Loading user...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1120] to-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur">
            <h1 className="mb-4 text-4xl font-bold">Upload</h1>
            <p className="text-red-400">
              You must be logged in to upload an addon.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#030712] via-[#0b1120] to-black text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[160px]" />
        <div className="absolute right-[-120px] top-[20%] h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-[130px]" />
        <div className="absolute left-[-120px] bottom-[10%] h-[360px] w-[360px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

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
            Creator Upload
          </p>
          <h1 className="mb-3 text-5xl font-bold">Upload a New Addon</h1>
          <p className="text-zinc-400">
            Submit your addon for review before it becomes publicly available.
          </p>
        </div>

        <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Addon Title
            </label>
            <input
              className="w-full rounded-2xl border border-zinc-700 bg-black/30 p-4 outline-none placeholder:text-zinc-500 focus:border-blue-500"
              placeholder="Enter addon title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Description
            </label>
            <textarea
              className="min-h-[160px] w-full rounded-2xl border border-zinc-700 bg-black/30 p-4 outline-none placeholder:text-zinc-500 focus:border-blue-500"
              placeholder="Describe your addon"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Simulator
              </label>
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
              <label className="mb-2 block text-sm text-zinc-400">
                Category
              </label>
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
              <label className="mb-2 block text-sm text-zinc-400">
                Version
              </label>
              <input
                className="w-full rounded-2xl border border-zinc-700 bg-black/30 p-4 outline-none placeholder:text-zinc-500 focus:border-blue-500"
                placeholder="1.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Addon File
            </label>
            <input
              id="addon-file-input"
              type="file"
              className="block w-full rounded-xl border border-zinc-700 bg-black/20 p-3 text-sm text-zinc-300"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Cover Image (optional)
            </label>
            <input
              id="addon-image-input"
              type="file"
              accept="image/*"
              className="block w-full rounded-xl border border-zinc-700 bg-black/20 p-3 text-sm text-zinc-300"
              onChange={(e) => {
                const selectedImage = e.target.files?.[0] || null;
                setImage(selectedImage);

                if (selectedImage) {
                  setImagePreview(URL.createObjectURL(selectedImage));
                } else {
                  setImagePreview(null);
                }
              }}
            />

            {imagePreview && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-zinc-400">Preview</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 w-full rounded-2xl border border-zinc-800 object-cover"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full rounded-2xl bg-blue-600 px-6 py-4 font-semibold shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Publish for Review"}
          </button>
        </div>
      </div>
    </main>
  );
}