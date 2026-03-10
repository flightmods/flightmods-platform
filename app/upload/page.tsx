"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const fileName = `${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from("addons")
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return;
    }

    const fileUrl = supabase.storage
      .from("addons")
      .getPublicUrl(fileName).data.publicUrl;

    await supabase.from("addons").insert([
      {
        title,
        description,
        file_url: fileUrl,
        author: "testuser",
        version: "1.0",
        downloads: 0,
      },
    ]);

    alert("Addon uploaded!");
  };

  return (
    <main className="max-w-xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Upload Addon</h1>

      <input
        className="w-full mb-4 p-2 bg-zinc-800 rounded"
        placeholder="Addon title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full mb-4 p-2 bg-zinc-800 rounded"
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        className="mb-4"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        className="bg-blue-600 px-6 py-2 rounded"
        onClick={handleUpload}
      >
        Upload
      </button>
    </main>
  );
}