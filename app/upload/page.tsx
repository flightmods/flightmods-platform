"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type UserLike = {
  id: string;
  email?: string;
};

export default function UploadPage() {
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sim, setSim] = useState("MSFS 2020");
  const [category, setCategory] = useState("Aircraft");
  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState<UserLike | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Fehler beim Laden des Users:", error.message);
        setUser(null);
      } else {
        setUser(data.user ?? null);
      }

      setLoading(false);
    };

    getUser();
  }, []);

  const handleUpload = async () => {
    if (!user) {
      alert("Du musst eingeloggt sein, um ein Addon hochzuladen.");
      return;
    }

    if (!title.trim()) {
      alert("Bitte einen Titel eingeben.");
      return;
    }

    if (!description.trim()) {
      alert("Bitte eine Beschreibung eingeben.");
      return;
    }

    if (!file) {
      alert("Bitte eine Datei auswählen.");
      return;
    }

    setUploading(true);

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError || !profileData) {
        alert("Bitte richte zuerst dein Profil ein.");
        window.location.href = "/setup-profile";
        setUploading(false);
        return;
      }

      const safeFileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

      const { error: uploadError } = await supabase.storage
        .from("addons")
        .upload(safeFileName, file);

      if (uploadError) {
        alert(`Upload fehlgeschlagen: ${uploadError.message}`);
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("addons").getPublicUrl(safeFileName);

      let imageUrl: string | null = null;

if (image) {
  const imageName = `${Date.now()}_${image.name.replace(/\s+/g, "_")}`;

  const { error: imageUploadError } = await supabase.storage
    .from("addon-images")
    .upload(imageName, image);

  if (imageUploadError) {
    alert(`Bild-Upload fehlgeschlagen: ${imageUploadError.message}`);
    setUploading(false);
    return;
  }

  const {
    data: { publicUrl: imagePublicUrl },
  } = supabase.storage.from("addon-images").getPublicUrl(imageName);

  imageUrl = imagePublicUrl;
}

      const { error: insertError } = await supabase.from("addons").insert([
        {
          title: title.trim(),
          description: description.trim(),
          sim,
          category,
          file_url: publicUrl,
          image_url: imageUrl,
          author: profileData.username,
          author_id: user.id,
          author_name: profileData.username,
          version: "1.0",
          downloads: 0,
        },
      ]);

      if (insertError) {
        alert(`Datenbankeintrag fehlgeschlagen: ${insertError.message}`);
        setUploading(false);
        return;
      }

      alert("Addon erfolgreich hochgeladen!");

      setTitle("");
      setDescription("");
      setSim("MSFS 2020");
      setCategory("Aircraft");
      setFile(null);
      setImage(null);
      setImagePreview(null);

      const fileInput = document.getElementById(
        "addon-file-input"
      ) as HTMLInputElement | null;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(error);
      alert("Beim Upload ist ein unerwarteter Fehler aufgetreten.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <main className="max-w-xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6">Addon Upload</h1>
        <p className="text-zinc-400">Lade Benutzerinformationen...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="max-w-xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6">Addon Upload</h1>
        <p className="text-red-400">
          Du musst eingeloggt sein, um ein Addon hochzuladen.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Addon Upload</h1>

      <p className="text-zinc-400 mb-6">
        Eingeloggt als: <span className="text-white">{user.email}</span>
      </p>

      <input
        className="w-full mb-4 p-3 bg-zinc-800 rounded"
        placeholder="Addon Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full mb-4 p-3 bg-zinc-800 rounded min-h-[140px]"
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
  id="addon-file-input"
  type="file"
  className="mb-6 block w-full"
  onChange={(e) => setFile(e.target.files?.[0] || null)}
/>

<p className="text-sm text-zinc-400 mb-1">Screenshot / Cover Image</p>

<input
  type="file"
  accept="image/*"
  className="mb-4 block w-full"
  onChange={(e) => {
    const selectedImage = e.target.files?.[0] || null;
    setImage(selectedImage);

    if (selectedImage) {
      const previewUrl = URL.createObjectURL(selectedImage);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  }}
/>

{imagePreview && (
  <div className="mb-6">
    <p className="text-sm text-zinc-400 mb-2">Vorschau</p>
    <img
      src={imagePreview}
      alt="Bildvorschau"
      className="w-full max-h-64 object-cover rounded-xl border border-zinc-800"
    />
  </div>
)}

      <button
        className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Lade hoch..." : "Upload"}
      </button>
    </main>
  );
}