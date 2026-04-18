import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const FILE_BUCKET = "addons";
const IMAGE_BUCKET = "addon-images";

function extractPathFromPublicUrl(fileUrl: string, bucketName: string): string | null {
  try {
    const url = new URL(fileUrl);
    const marker = `/storage/v1/object/public/${bucketName}/`;
    const index = url.pathname.indexOf(marker);

    if (index === -1) {
      return null;
    }

    return decodeURIComponent(url.pathname.substring(index + marker.length));
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { addonId, userId } = body as {
      addonId?: string;
      userId?: string;
    };

    if (!addonId || !userId) {
      return NextResponse.json(
        { error: "Missing addonId or userId." },
        { status: 400 }
      );
    }

    const { data: addon, error: addonError } = await supabaseAdmin
      .from("addons")
      .select("id, author_id, file_url, image_url")
      .eq("id", addonId)
      .maybeSingle();

    if (addonError) {
      return NextResponse.json(
        { error: addonError.message },
        { status: 500 }
      );
    }

    if (!addon) {
      return NextResponse.json(
        { error: "Addon not found." },
        { status: 404 }
      );
    }

    if (addon.author_id !== userId) {
      return NextResponse.json(
        { error: "You are not allowed to delete this addon." },
        { status: 403 }
      );
    }

    const filePath = addon.file_url
      ? extractPathFromPublicUrl(addon.file_url, FILE_BUCKET)
      : null;

    const imagePath = addon.image_url
      ? extractPathFromPublicUrl(addon.image_url, IMAGE_BUCKET)
      : null;

    if (filePath) {
      const { error: fileDeleteError } = await supabaseAdmin.storage
        .from(FILE_BUCKET)
        .remove([filePath]);

      if (fileDeleteError) {
        console.error("FILE DELETE ERROR:", fileDeleteError);
      }
    }

    if (imagePath) {
      const { error: imageDeleteError } = await supabaseAdmin.storage
        .from(IMAGE_BUCKET)
        .remove([imagePath]);

      if (imageDeleteError) {
        console.error("IMAGE DELETE ERROR:", imageDeleteError);
      }
    }

    const { error: deleteRowError } = await supabaseAdmin
      .from("addons")
      .delete()
      .eq("id", addonId);

    if (deleteRowError) {
      return NextResponse.json(
        { error: deleteRowError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Addon deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE ADDON API ERROR:", error);

    return NextResponse.json(
      { error: "Unexpected server error while deleting addon." },
      { status: 500 }
    );
  }
}