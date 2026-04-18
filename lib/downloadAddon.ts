import { supabase } from "@/lib/supabase";

export async function downloadAddon(fileUrl: string) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  console.log("DOWNLOAD SESSION:", session);
  console.log("DOWNLOAD SESSION ERROR:", sessionError);

  if (sessionError) {
    throw new Error("Session error. Please log in again.");
  }

  if (!session?.access_token) {
    throw new Error("Please log in to download this addon.");
  }

  const res = await fetch("/api/download", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileUrl }),
  });

  const data = await res.json();

  console.log("DOWNLOAD API RESPONSE:", data);

  if (!res.ok) {
    throw new Error(data.error || "Download failed.");
  }

  window.location.href = data.url;
}