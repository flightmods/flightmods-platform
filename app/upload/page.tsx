"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sim, setSim] = useState("MSFS 2020");
  const [category, setCategory] = useState("Aircraft");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Bitte eine Datei auswählen.");
      return;
    }

    const fileName = `${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("addons")
      .upload(fileName, file);

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    const fileUrl = supabase.storage
      .from("addons")
      .getPublicUrl(fileName).data.publicUrl;

    const { error: insertError } = await supabase.from("addons").insert([
      {
        title,
        description,
        sim,
        category,
        file_url: fileUrl,
        author: "testuser",
        version: "1.0",
        downloads: 0,
      },
    ]);

    if (insertError) {
      alert(insertError.message);
      return;
    }

    alert("Addon erfolgreich hochgeladen!");

    setTitle("");
    setDescription("");
    setSim("MSFS 2020");
    setCategory("Aircraft");
    setFile(null);
  };

  return (
    <main className="max-w-xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Addon Upload</h1>

      <input
        className="w-full mb-4 p-3 bg-zinc-800 rounded"
        placeholder="Addon Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full mb-4 p-3 bg-zinc-800 rounded"
        placeholder="Beschreibung"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        className="w-full mb-4 p-3 bg-zinc-800 rounded"
        value={sim}
        onChange={(e) => setSim(e.target.value)}
      >
        <option>MSFS 2020</option>
        <option>MSFS 2024</option>
        <option>X-Plane</option>
      </select>

      <select
        className="w-full mb-4 p-3 bg-zinc-800 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>Aircraft</option>
        <option>Airports</option>
        <option>Liveries</option>
        <option>Scenery</option>
        <option>Utilities</option>
      </select>

      <input
        type="file"
        className="mb-4 block w-full"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700"
        onClick={handleUpload}
      >
        Upload
      </button>
    </main>
  );
}