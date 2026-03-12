"use client";

type DownloadButtonProps = {
  addonId: string;
  fileUrl: string;
};

export default function DownloadButton({
  addonId,
  fileUrl,
}: DownloadButtonProps) {
  const handleDownload = async () => {
    try {
      await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: addonId }),
      });
    } catch (error) {
      console.error("Failed to update download count:", error);
    }

    window.open(fileUrl, "_blank");
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-block rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700"
    >
      Download
    </button>
  );
}