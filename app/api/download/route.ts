import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing addon id" }, { status: 400 });
    }

    const { data: addon, error: fetchError } = await supabase
      .from("addons")
      .select("downloads")
      .eq("id", id)
      .single();

    if (fetchError || !addon) {
      return NextResponse.json({ error: "Addon not found" }, { status: 404 });
    }

    const currentDownloads = addon.downloads ?? 0;

    const { error: updateError } = await supabase
      .from("addons")
      .update({ downloads: currentDownloads + 1 })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}