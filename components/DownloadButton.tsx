"use client";

import { useState } from "react";
import { downloadAddon } from "@/lib/downloadAddon";

type DownloadButtonProps = {
  addonId: string;
  fileUrl: string;
};

export default function DownloadButton({
  addonId,
  fileUrl,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setError("");

      await downloadAddon(fileUrl);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Download failed.";
      console.error("DOWNLOAD BUTTON ERROR:", message);
      setError(message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        data-addon-id={addonId}
        className="rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDownloading ? "Downloading..." : "Download"}
      </button>

      {error ? (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      ) : null}
    </div>
  );
}