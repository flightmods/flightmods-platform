import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const BUCKET_NAME = "addons";

function extractStoragePathFromFileUrl(fileUrl: string): string | null {
  try {
    const url = new URL(fileUrl);
    const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
    const fullPath = url.pathname;

    const index = fullPath.indexOf(marker);
    if (index === -1) return null;

    return decodeURIComponent(fullPath.substring(index + marker.length));
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // 🔐 TOKEN holen
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "").trim();

    // 🔐 USER VALIDIEREN (über ADMIN CLIENT)
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    // 📦 BODY
    const body = await req.json();
    const { fileUrl } = body as { fileUrl?: string };

    if (!fileUrl) {
      return NextResponse.json(
        { error: "Missing fileUrl" },
        { status: 400 }
      );
    }

    // 🔍 ADDON CHECK
    const { data: addon, error: addonError } = await supabaseAdmin
      .from("addons")
      .select("id, status, downloads, file_url")
      .eq("file_url", fileUrl)
      .single();

    if (addonError || !addon) {
      return NextResponse.json(
        { error: "Addon not found" },
        { status: 404 }
      );
    }

    if (addon.status !== "approved") {
      return NextResponse.json(
        { error: "Addon not available" },
        { status: 403 }
      );
    }

    // 📁 STORAGE PATH
    const storagePath = extractStoragePathFromFileUrl(addon.file_url);

    if (!storagePath) {
      return NextResponse.json(
        { error: "Invalid file path" },
        { status: 500 }
      );
    }

    // 📊 DOWNLOAD COUNT
    await supabaseAdmin
      .from("addons")
      .update({
        downloads: (addon.downloads || 0) + 1,
      })
      .eq("id", addon.id);

    // 🔗 SIGNED URL
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .createSignedUrl(storagePath, 60);

    if (error || !data?.signedUrl) {
      return NextResponse.json(
        { error: error?.message || "Failed to generate URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: data.signedUrl,
    });
  } catch (error) {
    console.error("DOWNLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}