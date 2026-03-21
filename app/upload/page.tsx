"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sim, setSim] = useState("MSFS 2020");
  const [category, setCategory] = useState("Aircraft");
  const [version, setVersion] = useState("1.0");
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !title || !description) {
      alert("Bitte alle Pflichtfelder ausfüllen.");
      return;
    }

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("Du bist nicht eingeloggt.");
      setLoading(false);
      return;
    }

    let fileUrl = "";
    let imageUrl = "";

    // Datei Upload
    const fileName = `${Date.now()}_${file.name}`;
    const { error: fileError } = await supabase.storage
      .from("addons")
      .upload(fileName, file);

    if (fileError) {
      alert(fileError.message);
      setLoading(false);
      return;
    }

    fileUrl = supabase.storage.from("addons").getPublicUrl(fileName).data.publicUrl;

    // Bild Upload
    if (image) {
      const imageName = `${Date.now()}_${image.name}`;
      const { error: imageError } = await supabase.storage
        .from("images")
        .upload(imageName, image);

      if (!imageError) {
        imageUrl = supabase.storage
          .from("images")
          .getPublicUrl(imageName).data.publicUrl;
      }
    }

    const { error: insertError } = await supabase.from("addons").insert({
      title,
      description,
      sim,
      category,
      version,
      file_url: fileUrl,
      image_url: imageUrl,
      downloads: 0,
      author_id: user.id,
      author: user.email,
    });

    if (insertError) {
      alert(insertError.message);
      setLoading(false);
      return;
    }

    alert("Addon successfully uploaded!");
    window.location.href = "/addons";
  };

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

      <div className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-10">
          <p className="text-blue-300 uppercase text-sm tracking-widest mb-2">
            Creator Upload
          </p>

          <h1 className="text-5xl font-bold mb-3">
            Upload new add-on
          </h1>

          <p className="text-zinc-400">
            Share your work with the community and reach Flight Simulator users worldwide.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 backdrop-blur p-6 space-y-6">

          <input
            placeholder="Title of the add-on"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 rounded-xl bg-black/30 border border-zinc-700 focus:border-blue-500 outline-none"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 rounded-xl bg-black/30 border border-zinc-700 focus:border-blue-500 outline-none min-h-[140px]"
          />

          <div className="grid md:grid-cols-3 gap-4">
            <select
              value={sim}
              onChange={(e) => setSim(e.target.value)}
              className="p-4 rounded-xl bg-black/30 border border-zinc-700"
            >
              <option>MSFS 2020</option>
              <option>MSFS 2024</option>
              <option>X-Plane</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-4 rounded-xl bg-black/30 border border-zinc-700"
            >
              <option>Aircraft</option>
              <option>Airports</option>
              <option>Liveries</option>
              <option>Scenery</option>
              <option>Utilities</option>
            </select>

            <input
              placeholder="Version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="p-4 rounded-xl bg-black/30 border border-zinc-700"
            />
          </div>

          <div>
            <p className="mb-2 text-sm text-zinc-400">Addon File</p>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
          </div>

          <div>
            <p className="mb-2 text-sm text-zinc-400">Preview Image (optional)</p>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-blue-600 py-4 rounded-xl font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition"
          >
            {loading ? "Uploading..." : "Publish"}
          </button>
        </div>
      </div>
    </main>
  );
}